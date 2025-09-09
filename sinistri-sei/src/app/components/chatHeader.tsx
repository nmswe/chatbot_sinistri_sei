const sixSinisters = [
    {id: 1, src: '/doc_ock.svg', alt: 'Doc Ock'},
    {id: 2, src: '/electro.svg', alt: 'Electro'},
    {id: 3, src: '/kraven.svg', alt: 'Kraven'},
    {id: 4, src: '/mysterio.svg', alt: 'Mysterio'},
    {id: 5, src: '/vulture.svg', alt: 'Vulture'},
    {id: 6, src: '/sandman.svg', alt: 'Sandman'},
];

export default function ChatHeader() {
    return (
        <div className="py-3 flex justify-between border-b border-gray-200">
            {sixSinisters.map((s) => (
                <img key={s.id} src={s.src} alt={s.alt} className="w-14" />
            ))}
        </div>
    );
}
