function Announcements() {
  return (
    <div className="bg-white rounded-md p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Annoucements</h1>
        <span className="text-xs text-gray-400 cursor-pointer">Veiw All</span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-lamaSkyLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md p-1">
              2025-03-18
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores
            tempora obcaecati possimus consectetur voluptas nesciunt natus
            beatae
          </p>
        </div>

        <div className="bg-lamaPurpleLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md p-1">
              2025-03-18
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores
            tempora obcaecati possimus consectetur voluptas nesciunt natus
            beatae
          </p>
        </div>

        <div className="bg-lamaYellowLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md p-1">
              2025-03-18
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores
            tempora obcaecati possimus consectetur voluptas nesciunt natus
            beatae
          </p>
        </div>
      </div>
    </div>
  );
}

export default Announcements;
