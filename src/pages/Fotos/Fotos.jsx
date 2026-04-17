import { useEffect, useRef, useState } from "react";
import "./Fotos.css";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
const FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER?.trim();
const GALLERY_KEY =
  import.meta.env.VITE_CLOUDINARY_GALLERY_TAG?.trim() ||
  FOLDER ||
  "wedding-gallery";

const buildDeliveryUrl = (resource, transformations) => {
  if (!CLOUD_NAME || !resource?.public_id || !resource?.format) {
    return resource?.secure_url || "";
  }

  const versionSegment = resource.version ? `v${resource.version}/` : "";

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${versionSegment}${resource.public_id}.${resource.format}`;
};

const normalizeImage = (resource) => ({
  id: resource.asset_id || resource.public_id,
  alt: resource.original_filename || "Foto de la boda",
  createdAt: resource.created_at || "",
  fullUrl: buildDeliveryUrl(resource, "f_auto,q_auto,w_1600"),
  thumbUrl: buildDeliveryUrl(resource, "f_auto,q_auto,c_fill,g_auto,w_420,h_420"),
  sourceUrl: resource.secure_url || "",
  status: "ready",
  errorMessage: "",
});

const createPreviewImage = (file) => {
  const previewUrl = URL.createObjectURL(file);

  return {
    id: `local-${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    alt: file.name || "Foto de la boda",
    createdAt: new Date().toISOString(),
    fullUrl: previewUrl,
    thumbUrl: previewUrl,
    isLocalPreview: true,
    status: "uploading",
    errorMessage: "",
  };
};

const preloadImage = (src) =>
  new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error("Missing image source"));
      return;
    }

    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = () => reject(new Error("Image preload failed"));
    image.src = src;
  });

const Fotos = () => {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryRefreshing, setGalleryRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSummary, setUploadSummary] = useState({
    total: 0,
    completed: 0,
  });

  const isConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

  const mergeImages = (nextImages) => {
    setImages((currentImages) => {
      const mergedMap = new Map();

      [...nextImages, ...currentImages].forEach((image) => {
        const previousImage = mergedMap.get(image.id);

        if (!previousImage) {
          mergedMap.set(image.id, image);
          return;
        }

        const nextImage =
          previousImage.status === "uploading" && image.status === "ready"
            ? image
            : previousImage;

        mergedMap.set(image.id, nextImage);
      });

      return Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    });
  };

  const replacePreviewImage = (previewId, nextImage) => {
    setImages((currentImages) =>
      currentImages.map((image) => (image.id === previewId ? nextImage : image)),
    );
  };

  const updatePreviewStatus = (previewId, status, errorMessage = "") => {
    setImages((currentImages) =>
      currentImages.map((image) =>
        image.id === previewId
          ? {
              ...image,
              status,
              errorMessage,
            }
          : image,
      ),
    );
  };

  const syncGallery = (remoteImages) => {
    setImages((currentImages) => {
      const localTransientImages = currentImages.filter(
        (image) =>
          image.isLocalPreview ||
          image.status === "error" ||
          image.status === "uploading" ||
          image.status === "processing",
      );

      const knownReadyImages = currentImages.filter(
        (image) => !image.isLocalPreview && image.status === "ready",
      );

      const mergedMap = new Map();

      [...remoteImages, ...knownReadyImages, ...localTransientImages].forEach((image) => {
        if (!mergedMap.has(image.id)) {
          mergedMap.set(image.id, image);
        }
      });

      return Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    });
  };

  const loadGallery = async () => {
    if (!CLOUD_NAME) {
      setGalleryLoading(false);
      setGalleryError(
        "Configura VITE_CLOUDINARY_CLOUD_NAME para poder mostrar la galeria.",
      );
      return;
    }

    try {
      if (images.length === 0) {
        setGalleryLoading(true);
      } else {
        setGalleryRefreshing(true);
      }
      setGalleryError("");

      const response = await fetch(
        `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${encodeURIComponent(GALLERY_KEY)}.json?${Date.now()}`,
      );

      if (!response.ok) {
        throw new Error("No se ha podido cargar la galeria");
      }

      const data = await response.json();
      const parsedImages = (data.resources || [])
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(normalizeImage);

      syncGallery(parsedImages);
    } catch (error) {
      setGalleryError(
        "No he podido cargar la galeria. Revisa la configuracion de Cloudinary y que el listado publico de recursos este habilitado.",
      );
    } finally {
      setGalleryLoading(false);
      setGalleryRefreshing(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedImage]);

  const openPicker = () => {
    if (!isConfigured) {
      return;
    }

    inputRef.current?.click();
  };

  const uploadFiles = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length || !isConfigured) {
      return;
    }

    const previewImages = files.map(createPreviewImage);
    mergeImages(previewImages);

    try {
      setUploading(true);
      setUploadError("");
      setUploadSummary({
        total: files.length,
        completed: 0,
      });

      const uploadResults = await Promise.allSettled(
        files.map(async (file, index) => {
          const previewImage = previewImages[index];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", UPLOAD_PRESET);
          formData.append("tags", GALLERY_KEY);

          if (FOLDER) {
            formData.append("folder", FOLDER);
          }

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            },
          );

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const data = await response.json();
          const uploadedImage = normalizeImage(data);

          updatePreviewStatus(
            previewImage.id,
            "processing",
            "Preparando imagen...",
          );

          try {
            await preloadImage(uploadedImage.thumbUrl);
          } catch (thumbError) {
            await preloadImage(uploadedImage.sourceUrl || uploadedImage.fullUrl);
            uploadedImage.thumbUrl = uploadedImage.sourceUrl || uploadedImage.fullUrl;
          }

          replacePreviewImage(previewImage.id, uploadedImage);
          URL.revokeObjectURL(previewImage.thumbUrl);
          setUploadSummary((currentSummary) => ({
            ...currentSummary,
            completed: currentSummary.completed + 1,
          }));
        }),
      );

      const failedUploads = uploadResults.filter(
        (result) => result.status === "rejected",
      );

      if (failedUploads.length > 0) {
        uploadResults.forEach((result, index) => {
          const previewImage = previewImages[index];

          if (result.status === "rejected" && previewImage) {
            updatePreviewStatus(
              previewImage.id,
              "error",
              "No se ha podido subir esta imagen.",
            );
          }
        });

        setUploadError(
          failedUploads.length === files.length
            ? "No se ha podido subir ninguna imagen. Revisa el preset de Cloudinary, el tamaño del archivo o tu conexion."
            : "Algunas imagenes no se han podido subir. Las marcadas en rojo necesitan volver a intentarse.",
        );
      }

      window.setTimeout(() => {
        void loadGallery();
      }, 1800);
    } catch (error) {
      previewImages.forEach((previewImage) => {
        updatePreviewStatus(
          previewImage.id,
          "error",
          "Se ha producido un error durante la subida.",
        );
      });
      setUploadError(
        "Se ha producido un error durante la subida. Revisa la configuracion y vuelve a intentarlo.",
      );
    } finally {
      event.target.value = "";
      setUploading(false);
      setUploadSummary({
        total: 0,
        completed: 0,
      });
    }
  };

  return (
    <div className="fotos-main">
      <section className="article-subida">
        <button
          className="subida-boton"
          type="button"
          onClick={openPicker}
          disabled={!isConfigured || uploading}
        >
          {uploading ? "Subiendo imagenes..." : "Subir imagenes"}
        </button>
        <input
          ref={inputRef}
          className="subida-input"
          type="file"
          accept="image/*"
          multiple
          onChange={uploadFiles}
        />
        {uploadError ? <p className="subida-mensaje">{uploadError}</p> : null}
        {uploading && uploadSummary.total > 0 ? (
          <p className="subida-estado">
            {uploadSummary.completed} de {uploadSummary.total} listas
          </p>
        ) : null}
        {!isConfigured ? (
          <p className="subida-mensaje">
            Falta configurar Cloudinary para subir imagenes.
          </p>
        ) : null}
      </section>

      <section className="article-fotos">
        <h4>Imágenes</h4>
        {galleryError ? <p className="galeria-feedback">{galleryError}</p> : null}
        {galleryLoading ? (
          <p className="galeria-feedback">Cargando imagenes...</p>
        ) : null}
        {!galleryLoading && galleryRefreshing ? (
          <p className="galeria-feedback">Actualizando galeria...</p>
        ) : null}
        {!galleryLoading && !galleryError && images.length === 0 ? (
          <p className="galeria-feedback">Aun no hay imagenes.</p>
        ) : null}
        <article className="container-fotos">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              className={`foto-card ${
                image.status === "uploading" ? "foto-card-uploading" : ""
              } ${
                image.status === "processing" ? "foto-card-processing" : ""
              } ${image.status === "error" ? "foto-card-error" : ""}`}
              onClick={() =>
                image.status === "ready" ? setSelectedImage(image) : null
              }
              disabled={image.status !== "ready"}
              aria-label={`Ver ${image.alt}`}
            >
              <img src={image.thumbUrl} alt={image.alt} loading="lazy" />
              {image.status === "uploading" ? (
                <span className="foto-card-estado">Subiendo...</span>
              ) : null}
              {image.status === "processing" ? (
                <span className="foto-card-estado">Preparando...</span>
              ) : null}
              {image.status === "error" ? (
                <span className="foto-card-estado foto-card-estado-error">
                  {image.errorMessage || "Error al subir"}
                </span>
              ) : null}
            </button>
          ))}
        </article>
      </section>

      {selectedImage ? (
        <div
          className="foto-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de la imagen"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="foto-modal-contenido"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="foto-modal-cerrar"
              onClick={() => setSelectedImage(null)}
              aria-label="Cerrar imagen"
            >
              ×
            </button>
            <img
              className="foto-modal-imagen"
              src={selectedImage.fullUrl || selectedImage.sourceUrl}
              alt={selectedImage.alt}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Fotos;
