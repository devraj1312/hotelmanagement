import '../styles/finance.scss';
import MonthlyRevenueChart from '../components/FinancePage/MonthlyRevenueChart';
import WeeklyRevenueChart from '../components/FinancePage/WeeklyRevenueChart';
import StaffSalaryBox from '../components/FinancePage/StaffSalaryBox';
import ExpenseBox from '../components/FinancePage/ExpenseBox';

const Finance = () => {
  return (
    <div className="finance-page">
      <h2>Finance & Reports</h2>

      <div className="finance-overview">
        <div className="finance-bottom-row">
          <MonthlyRevenueChart />
          <WeeklyRevenueChart />
        </div>

        <div className="finance-bottom-row">
          <StaffSalaryBox />
          <ExpenseBox />
        </div>
      </div>
    </div>
  );
};

export default Finance;
