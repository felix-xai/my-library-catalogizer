import { ImageUpload } from "@/components/ImageUpload";

export default function UploadPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] py-10 px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-stone-900 mb-4 font-serif">
                    Add to your Catalog
                </h1>
                <p className="text-stone-600 max-w-xl mx-auto text-lg leading-relaxed">
                    Take a clear photo of your bookshelf or a stack of books, and our AI will
                    magically extract the titles, authors, and cover art to build your library.
                </p>
            </div>

            <ImageUpload />
        </div>
    );
}
