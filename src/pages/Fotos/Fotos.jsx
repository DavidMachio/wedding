import { useEffect, useRef, useState } from "react";
import "./Fotos.css";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
const GALLERY_TAG =
  import.meta.env.VITE_CLOUDINARY_GALLERY_TAG?.trim() || "wedding-gallery";
const FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER?.trim();

const buildDeliveryUrl = (resource, transformations) => {
  if (!CLOUD_NAME || !resource?.public_id || !resource?.format) {
    return resource?.secure_url || "";
  }

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${resource.public_id}.${resource.format}`;
};

const normalizeImage = (resource) => ({
  id: resource.asset_id || resource.public_id,
  alt: resource.original_filename || "Foto de la boda",
  createdAt: resource.created_at || "",
  fullUrl: buildDeliveryUrl(resource, "f_auto,q_auto,w_1600"),
  thumbUrl: buildDeliveryUrl(resource, "f_auto,q_auto,c_fill,g_auto,w_700,h_700"),
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
    isUploading: true,
  };
};

const Fotos = () => {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [uploadError, setUploadError] = useState("");

  const isConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

  const mergeImages = (nextImages) => {
    setImages((currentImages) => {
      const merged = [...nextImages, ...currentImages];
      const uniqueImages = merged.filter(
        (image, index, array) =>
          index === array.findIndex((candidate) => candidate.id === image.id),
      );

      return uniqueImages.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    });
  };

  const replacePreviewImage = (previewId, nextImage) => {
    setImages((currentImages) =>
      currentImages.map((image) => (image.id === previewId ? nextImage : image)),
    );
  };

  const removePreviewImage = (previewId) => {
    setImages((currentImages) =>
      currentImages.filter((image) => image.id !== previewId),
    );
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
      setGalleryLoading(true);
      setGalleryError("");

      const response = await fetch(
        `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${encodeURIComponent(GALLERY_TAG)}.json?${Date.now()}`,
      );

      if (!response.ok) {
        throw new Error("No se ha podido cargar la galeria");
      }

      const data = await response.json();
      const parsedImages = (data.resources || [])
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(normalizeImage);

      setImages(parsedImages);
    } catch (error) {
      setGalleryError(
        "No he podido leer las imagenes desde Cloudinary. Revisa que la etiqueta exista y que el listado JSON este habilitado en tu cuenta.",
      );
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

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

      await Promise.all(
        files.map(async (file, index) => {
          const previewImage = previewImages[index];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", UPLOAD_PRESET);
          formData.append("tags", GALLERY_TAG);

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
          replacePreviewImage(previewImage.id, normalizeImage(data));
          URL.revokeObjectURL(previewImage.thumbUrl);
        }),
      );

      void loadGallery();
    } catch (error) {
      previewImages.forEach((previewImage) => {
        removePreviewImage(previewImage.id);
        URL.revokeObjectURL(previewImage.thumbUrl);
      });
      setUploadError(
        "No he podido subir las imagenes. Comprueba el upload preset de Cloudinary y que permita subidas no firmadas.",
      );
    } finally {
      event.target.value = "";
      setUploading(false);
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
        {!galleryLoading && !galleryError && images.length === 0 ? (
          <p className="galeria-feedback">Aun no hay imagenes.</p>
        ) : null}
        <article className="container-fotos">
          {images.map((image) => (
            <div
              key={image.id}
              className={`foto-card ${image.isUploading ? "foto-card-uploading" : ""}`}
            >
              <img src={image.thumbUrl} alt={image.alt} loading="lazy" />
              {image.isUploading ? (
                <span className="foto-card-estado">Subiendo...</span>
              ) : null}
            </div>
          ))}
        </article>
      </section>
    </div>
  );
};

export default Fotos;
