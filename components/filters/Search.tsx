import { BsSearch } from "react-icons/bs";

const Search = ({
  value = "",
  handleOnChange,
  className = "",
}: {
  value?: string;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) => {
  return (
    <div className={"relative rounded-md shadow-sm " + className}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <BsSearch className="text-foreground" />
      </div>
      <input
        type="text"
        name="search"
        id="search"
        value={value}
        onChange={handleOnChange}
        className="block w-full rounded-md border border-gray-600 bg-transparent p-2 pl-10 text-foreground dark:border-gray-300 sm:text-sm"
        placeholder="Start typing to search..."
      />
    </div>
  );
};

export default Search;
