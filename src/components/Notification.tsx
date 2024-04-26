import CloseIcon from "../icons/CloseIcon";

interface NotificationProps {
    transcriptionName: string;
    setTranscriptionReady: (set: boolean) => void;
};

export default function Notification({ transcriptionName, setTranscriptionReady }: NotificationProps) {
    return (
        <div className=" bg-[#171717] border border-[#fefefe] border-opacity-50 rounded-md absolute top-5 right-5 z-50 shadow-lg shadow-black animate-slide-in-top p-5 text-pretty flex flex-col gap-1">
            <header className="flex justify-between">
                <h3 className="text-xl font-semibold">¡Transcripción terminada!</h3>
                <button onClick={() => { setTranscriptionReady(false); }} className="hover:bg-[#333] rounded-lg p-1">
                    <CloseIcon width={22} height={22} />
                </button>
            </header>
            <p><span className="font-medium">{transcriptionName}</span> disponible</p>
            <p className="">Por favor, revise su lista de transcripciones</p>
        </div>
    );
};