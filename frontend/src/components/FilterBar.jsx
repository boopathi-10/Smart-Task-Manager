const FilterBar = ({ filters, setFilters }) => {
  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="card shadow-sm p-3">
  <div className="row g-2">
    <div className="col-md-3">
      <input
        className="form-control"
        placeholder="Search tasks..."
        name="search"
        value={filters.search}
        onChange={handleChange}
      />
    </div>

    <div className="col-md-2">
      <select className="form-select" name="status" onChange={handleChange}>
        <option value="">All Status</option>
        <option>Todo</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
    </div>

    <div className="col-md-2">
      <select className="form-select" name="priority" onChange={handleChange}>
        <option value="">All Priority</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>

    <div className="col-md-2">
      <select className="form-select" name="sortBy" onChange={handleChange}>
        <option value="created_at">Newest</option>
        <option value="due_date">Due Date</option>
        <option value="priority">Priority</option>
      </select>
    </div>

    <div className="col-md-2">
      <select className="form-select" name="order" onChange={handleChange}>
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>
  </div>
</div>

  );
};

export default FilterBar;
