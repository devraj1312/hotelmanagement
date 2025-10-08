const dummyStaff = [
  { name: 'Anil Kumar', role: 'Receptionist', salary: 20000 },
  { name: 'Sunita Sharma', role: 'Housekeeping', salary: 15000 },
  { name: 'Ravi Verma', role: 'Manager', salary: 30000 },
  { name: 'Meena Joshi', role: 'Chef', salary: 25000 },
];

const StaffList = () => {
  return (
    <div className="staff-list">
      <h5><i className="bi bi-people-fill"></i> Staff Members</h5>
      <ul>
        {dummyStaff.map((staff, idx) => (
          <li key={idx}>
            <strong>{staff.name}</strong> - {staff.role} — ₹{staff.salary.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaffList;
