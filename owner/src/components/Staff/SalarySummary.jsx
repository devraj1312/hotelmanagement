const SalarySummary = () => {
  const totalSalary = 20000 + 15000 + 30000 + 25000;

  return (
    <div className="salary-summary">
      <h5><i className="bi bi-cash-coin"></i> Salary Summary</h5>
      <p>Total Staff Salary: <strong>₹{totalSalary.toLocaleString()}</strong></p>
    </div>
  );
};

export default SalarySummary;
