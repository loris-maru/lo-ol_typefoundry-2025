export default function AddBlock({
  addSection,
}: {
  addSection: (type: "one" | "two" | "three") => void;
}) {
  return (
    <div className="w-full mt-8 flex justify-center">
      <div className="text-center font-kronik">
        <h3 className="font-normal text-black text-2xl mb-2">
          Add New Section
        </h3>
        <div className="flex justify-center gap-x-2">
          <button
            type="button"
            aria-label="Add 1 Column Section"
            onClick={() => addSection("one")}
            className="pt-3 font-kronik text-2xl rounded-full cursor-pointer py-2 px-8 border border-solid border-black bg-transparent hover:bg-black hover:text-white transition-colors duration-300 ease-in-out"
          >
            1 Column
          </button>
          <button
            type="button"
            aria-label="Add 2 Columns Section"
            onClick={() => addSection("two")}
            className="pt-3 font-kronik text-2xl rounded-full cursor-pointer py-2 px-8 border border-solid border-black bg-transparent hover:bg-black hover:text-white transition-colors duration-300 ease-in-out"
          >
            2 Columns
          </button>
          <button
            type="button"
            aria-label=""
            onClick={() => addSection("three")}
            className="pt-3 font-kronik text-2xl rounded-full cursor-pointer py-2 px-8 border border-solid border-black bg-transparent hover:bg-black hover:text-white transition-colors duration-300 ease-in-out"
          >
            3 Columns
          </button>
        </div>
      </div>
    </div>
  );
}
