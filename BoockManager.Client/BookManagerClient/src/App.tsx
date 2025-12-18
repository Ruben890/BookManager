import { useState, useEffect } from 'react'
import type { BaseResponse } from './Interfaces/BaseResponse';
import type { Book } from './Interfaces/Book';
import { BookCard } from './Components/booksCard';
import { BookModal } from './Components/BookModal';

function App() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [searchId, setSearchId] = useState("");
  const [filteredBook, setFilteredBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [alert, setAlert] = useState<{ msg: string; type: string } | null>(null);

  const API_URL = import.meta.env.VITE_BASE_URL_API;

  useEffect(() => {
    fetchAllBooks();
  }, []);

  // --- Sistema de Alertas ---
  const showAlert = (message: string, statusCode: number) => {
    let type = "alert-error"; 
    if (statusCode >= 200 && statusCode < 300) type = "alert-success";
    if (statusCode >= 400 && statusCode < 500) type = "alert-warning";
    
    setAlert({ msg: message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // --- Operaciones API ---
  const fetchAllBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}api/Book`);
      const data: BaseResponse<Book[]> = await response.json();
      if (data.details) {
        setAllBooks(Array.isArray(data.details) ? data.details : [data.details as unknown as Book]);
      }
    } catch (err) {
      showAlert("Error al cargar el catálogo" + err, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBook = async (formData: FormData) => {
    const url = selectedBook ? `${API_URL}api/Book/${selectedBook.id}` : `${API_URL}api/Book`;
    const method = selectedBook ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method, body: formData });
      const data = await response.json();
      
      showAlert(data.message, data.statusCode);
      if (response.ok) {
        setIsModalOpen(false);
        fetchAllBooks();
      }
    } catch (err) {
      showAlert("Error al procesar la solicitud" + err, 500);
    }
  };

  // Eliminar imagen específica (Endpoint: DELETE api/Book/{id}/image)
  const handleDeleteImage = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}api/Book/${id}/image`, { method: 'DELETE' });
      const data = await response.json();
      
      showAlert(data.message, data.statusCode);
      if (response.ok) {
        // Actualizamos el estado local para que el modal se refresque inmediatamente
        if (selectedBook && selectedBook.id === id) {
          setSelectedBook({ ...selectedBook, portalSrc: "" });
        }
        fetchAllBooks();
      }
    } catch (err) {
      showAlert("Error al eliminar la imagen" + err, 500);
    }
  };

  const handleDelete = async () => {
    if (!bookToDelete) return;
    try {
      const response = await fetch(`${API_URL}api/Book/${bookToDelete.id}`, { method: 'DELETE' });
      const data = await response.json();
      
      showAlert(data.message, data.statusCode);
      if (response.ok) {
        setAllBooks(prev => prev.filter(b => b.id !== bookToDelete.id));
        setBookToDelete(null);
      }
    } catch (err) {
      showAlert("Error al eliminar el libro" + err, 500);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) { setFilteredBook(null); return; }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}api/Book/${searchId}`);
      const data: BaseResponse<Book> = await response.json();
      if (response.ok && data.details) {
        setFilteredBook(Array.isArray(data.details) ? data.details[0] : data.details);
      } else {
        showAlert("Libro no encontrado", 404);
      }
    } catch (err) {
      showAlert("Error en la búsqueda" + err, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8 font-sans">
      {/* Toast de Alertas */}
      {alert && (
        <div className="toast toast-top toast-end z-40">
          <div className={`alert ${alert.type} shadow-lg animate-in fade-in slide-in-from-top-2`}>
            <span className="font-bold text-xs uppercase tracking-wider">{alert.msg}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-5xl font-display font-black text-primary tracking-tighter text-center md:text-left">
              BOOK SHELF
            </h1>
            <p className="uppercase tracking-[0.3em] text-[10px] font-bold opacity-40 text-center md:text-left">
              Sistema de Gestión de Biblioteca
            </p>
          </div>
          <button 
            className="btn btn-primary shadow-xl font-bold px-8 hover:scale-105 transition-transform"
            onClick={() => { setSelectedBook(null); setIsModalOpen(true); }}
          >
            + AÑADIR LIBRO
          </button>
        </header>

        {/* Buscador */}
        <section className="flex justify-center mb-12">
          <form onSubmit={handleSearch} className="join w-full max-w-md shadow-sm border border-base-300">
            <input 
              type="number" 
              placeholder="ID del libro..." 
              className="input input-bordered join-item w-full focus:outline-primary" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button type="submit" className="btn btn-primary join-item px-8">BUSCAR</button>
            {filteredBook && (
              <button type="button" className="btn btn-ghost join-item" onClick={() => {setSearchId(""); setFilteredBook(null);}}>✕</button>
            )}
          </form>
        </section>

        {/* Grid de Libros */}
        {loading && allBooks.length === 0 ? (
          <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(filteredBook ? [filteredBook] : allBooks).map((book) => (
              <div key={book.id} className="group relative animate-in fade-in zoom-in duration-300">
                <BookCard book={book} API_BASE_URL={API_URL} />
                
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <button 
                    className="btn btn-circle btn-xs btn-warning shadow-md border-none"
                    onClick={() => { setSelectedBook(book); setIsModalOpen(true); }}
                  >✎</button>
                  <button 
                    className="btn btn-circle btn-xs btn-error text-white shadow-md border-none"
                    onClick={() => setBookToDelete(book)}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !filteredBook && allBooks.length === 0 && (
          <div className="text-center py-20 opacity-20">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-2xl font-bold font-display uppercase tracking-widest">Biblioteca Vacía</p>
          </div>
        )}
      </div>

      {/* MODAL PRINCIPAL */}
      <BookModal 
        key={selectedBook ? `edit-${selectedBook.id}-${selectedBook.portalSrc}` : 'new-book'}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSaveBook} 
        onDeleteImage={handleDeleteImage}
        bookToEdit={selectedBook} 
      />

      {/* CONFIRMACIÓN DE ELIMINACIÓN */}
      <dialog className={`modal ${bookToDelete ? 'modal-open' : ''} backdrop-blur-sm`}>
        <div className="modal-box border-t-8 border-error rounded-3xl">
          <h3 className="font-display font-black text-2xl text-error uppercase tracking-tighter">Eliminar Registro</h3>
          <p className="py-6 font-medium opacity-70">
            ¿Estás completamente seguro de borrar <span className="text-primary font-bold underline">"{bookToDelete?.title}"</span>? Esta acción no se puede deshacer.
          </p>
          <div className="modal-action">
            <button className="btn btn-ghost font-bold" onClick={() => setBookToDelete(null)}>CANCELAR</button>
            <button className="btn btn-error text-white font-black px-8" onClick={handleDelete}>BORRAR AHORA</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default App