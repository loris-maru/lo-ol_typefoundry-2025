export default function AddBlock({
  addSection,
}: {
  addSection: (type: "one" | "two" | "three") => void;
}) {
  return (
    <div className="w-full mt-8 flex justify-center">
      <div className="w-[45%] mt-10 text-center font-whisper border border-solid border-black py-5 px-8 rounded-xl">
        <div className="font-normal text-black text-lg mb-2 uppercase tracking-wider">
          Add New Section
        </div>
        <div className="flex w-full flex-row justify-between gap-x-2">
          <button
            type="button"
            aria-label="Add 1 Column Section"
            onClick={() => addSection("one")}
            className="pt-3 font-whisper font-medium text-xl rounded-full cursor-pointer py-2 px-8 border border-solid border-black bg-transparent hover:bg-black hover:text-white transition-colors duration-300 ease-in-out"
          >
            1 Column
          </button>
          <button
            type="button"
            aria-label="Add 2 Columns Section"
            onClick={() => addSection("two")}
            className="pt-3 font-whisper font-medium text-xl rounded-full cursor-pointer py-2 px-8 border border-solid border-black bg-transparent hover:bg-black hover:text-white transition-colors duration-300 ease-in-out"
          >
            2 Columns
          </button>
          <button
            type="button"
            aria-label=""
            onClick={() => addSection("three")}
            className="pt-3 font-whisper font-medium text-xl rounded-full cursor-pointer py-2 px-8 border border-solid border-black bg-transparent hover:bg-black hover:text-white transition-colors duration-300 ease-in-out"
          >
            3 Columns
          </button>
        </div>
      </div>
    </div>
  );
}
