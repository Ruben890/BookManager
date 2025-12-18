import { useState } from "react";
import type { Book } from "../Interfaces/Book";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    onDeleteImage: (id: number) => Promise<void>;
    bookToEdit?: Book | null;
}

const emptyBook = {
    title: "",
    description: "",
    author: "",
    publishDate: new Date().toISOString().split("T")[0],
    releaseDate: "",
};

export const BookModal = ({ isOpen, onClose, onSubmit, onDeleteImage, bookToEdit }: Props) => {
    // Inicialización de estado (usar 'key' en el padre para resetear)
    const [formData, setFormData] = useState({
        title: bookToEdit?.title ?? emptyBook.title,
        description: bookToEdit?.description ?? emptyBook.description,
        author: bookToEdit?.author ?? emptyBook.author,
        publishDate: bookToEdit?.publishDate?.split("T")[0] ?? emptyBook.publishDate,
        releaseDate: bookToEdit?.releaseDate?.split("T")[0] ?? "",
    });

    const [file, setFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        bookToEdit?.portalSrc ? `${import.meta.env.VITE_BASE_URL_API}${bookToEdit.portalSrc}` : null
    );

    // Lógica: Si el libro tiene portalSrc y NO hemos seleccionado un archivo nuevo,
    // significa que hay una imagen persistente en el servidor.
    const hasPersistentImage = bookToEdit?.portalSrc && !file;

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("author", formData.author);
        data.append("publishDate", formData.publishDate);
        if (formData.releaseDate) data.append("releaseDate", formData.releaseDate);
        
        // Solo enviamos la imagen si hay un archivo nuevo seleccionado
        if (file) data.append("image", file);

        onSubmit(data);
    };

    return (
        <div className="modal modal-open backdrop-blur-md transition-all">
            <div className="modal-box max-w-2xl border border-base-300 shadow-2xl p-8 bg-base-100 rounded-3xl">
                <header className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="font-display font-black text-3xl text-primary tracking-tight">
                            {bookToEdit ? "Editar Libro" : "Nuevo Libro"}
                        </h3>
                        <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">
                            Gestión de catálogo bibliográfico
                        </p>
                    </div>
                    <button type="button" className="btn btn-circle btn-ghost btn-sm" onClick={onClose}>✕</button>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Columna Izquierda */}
                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text text-xs font-bold uppercase opacity-60">Título <span className="text-error">*</span></span>
                                </label>
                                <input type="text" className="input input-bordered w-full" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>

                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text text-xs font-bold uppercase opacity-60">Autor <span className="text-error">*</span></span>
                                </label>
                                <input type="text" className="input input-bordered w-full" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} required />
                            </div>

                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text text-xs font-bold uppercase opacity-60">Descripción (Máx 500) <span className="text-error">*</span></span>
                                </label>
                                <textarea className="textarea textarea-bordered h-32 w-full resize-none" maxLength={500} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label py-1 text-xs font-bold uppercase opacity-60">Publicación <span className="text-error">*</span></label>
                                <input type="date" className="input input-bordered w-full" value={formData.publishDate} onChange={e => setFormData({ ...formData, publishDate: e.target.value })} required />
                            </div>

                            <div className="form-control">
                                <label className="label py-1 text-xs font-bold uppercase opacity-60">Lanzamiento (Opcional)</label>
                                <input type="date" className="input input-bordered w-full" value={formData.releaseDate} onChange={e => setFormData({ ...formData, releaseDate: e.target.value })} />
                            </div>

                            <div className="form-control">
                                <label className="label py-1 text-xs font-bold uppercase opacity-60">Portada del libro</label>
                                
                                {hasPersistentImage ? (
                                    <div className="bg-warning/10 border border-warning/20 p-3 rounded-xl flex flex-col gap-2">
                                        <p className="text-[10px] text-warning-content font-bold uppercase text-center">
                                            Imagen existente en servidor
                                        </p>
                                        <button 
                                            type="button" 
                                            className="btn btn-error btn-xs text-white"
                                            onClick={() => bookToEdit && onDeleteImage(bookToEdit.id!)}
                                        >
                                            Eliminar para cambiar
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="file-input file-input-bordered file-input-primary w-full file-input-sm"
                                        onChange={e => {
                                            const f = e.target.files?.[0];
                                            if (f) {
                                                setFile(f);
                                                setImagePreview(URL.createObjectURL(f));
                                            }
                                        }}
                                    />
                                )}

                                <div className="mt-4 relative group">
                                    {imagePreview ? (
                                        <div className="bg-base-200 rounded-xl p-3 border-2 border-dashed border-base-300 relative">
                                            <p className="text-[9px] uppercase font-black mb-2 opacity-40 text-center tracking-tighter">
                                                {file ? "Nueva imagen seleccionada" : "Imagen actual en sistema"}
                                            </p>
                                            <img src={imagePreview} className="h-36 mx-auto rounded-lg shadow-md object-cover" alt="Preview" />
                                            
                                            {/* Botón para deshacer selección de archivo local (antes de subir) */}
                                            {file && (
                                                <button 
                                                    type="button" 
                                                    className="absolute top-1 right-1 btn btn-circle btn-xs btn-ghost"
                                                    onClick={() => { setFile(null); setImagePreview(null); }}
                                                >✕</button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-36 w-full bg-base-200 rounded-xl border-2 border-dashed border-base-300 flex items-center justify-center opacity-30">
                                            <p className="text-[10px] font-black uppercase tracking-widest">Sin Portada</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-action flex gap-3">
                        <button type="button" className="btn btn-ghost rounded-xl flex-1 font-bold" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary rounded-xl flex-2 font-display font-black uppercase tracking-widest text-xs">
                            {bookToEdit ? "Actualizar Datos" : "Confirmar y Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};