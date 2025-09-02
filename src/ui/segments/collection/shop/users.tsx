export default function Users({
  users,
  setUsers,
}: {
  users: [number, number];
  setUsers: (users: [number, number]) => void;
}) {
  return (
    <div className="flex flex-row items-center gap-x-3">
      <label className="font-whisper text-base text-white">Users</label>
      <select
        name="license"
        id="license"
        value={users.join(',')}
        onChange={(e) => {
          const numbers = e.target.value.split(',').map(Number);
          setUsers([numbers[0], numbers[1]]);
        }}
        className="font-whisper rounded-full border border-solid border-gray-600 px-3 py-2 text-base text-white"
      >
        <option value="1,4">1-4</option>
        <option value="5,20">5-20</option>
        <option value="20,100">20-100</option>
      </select>
    </div>
  );
}
