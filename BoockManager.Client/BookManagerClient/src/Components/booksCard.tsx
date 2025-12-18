import type { Book } from "../Interfaces/Book";

interface BookCardProps {
    book: Book;
    API_BASE_URL: string;
}

export const BookCard = ({ book, API_BASE_URL }: BookCardProps) => {

    // Función para truncar el texto
    const truncateText = (text: string, limit: number) => {
        if (!text) return "";
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    };

    return (
        <div className="card bg-base-100 shadow-xl border border-base-300 hover:border-primary transition-all duration-300 group">
            <figure className="px-4 pt-4 h-64 relative overflow-hidden">
                <img
                    src={`${API_BASE_URL.replace(/\/$/, "")}${book.portalSrc}`}
                    alt={book.title}
                    className="rounded-xl h-full w-full object-cover shadow-md"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x600?text=No+Cover";
                    }}
                />
            </figure>

            <div className="card-body p-5">
                <div className="flex justify-between items-start gap-2">
                    {/* Título truncado a 1 línea visualmente */}
                    <h2 className="card-title text-sm font-black font-display line-clamp-1 uppercase tracking-tight">
                        {book.title}
                    </h2>
                    <div className="badge badge-primary badge-xs p-2 font-bold font-sans">ID: {book.id}</div>
                </div>

                <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest mb-2">
                    {book.author}
                </p>

                {/* Descripción: Lógica de 150 caracteres para la Card */}
                <div className="bg-base-200/50 p-3 rounded-lg border border-base-300">
                    <p className="text-xs leading-relaxed opacity-80 font-medium">
                        {truncateText(book.description!, 150)}
                    </p>
                </div>

                <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary btn-sm btn-block font-black text-[10px] tracking-widest uppercase">
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
    );
};