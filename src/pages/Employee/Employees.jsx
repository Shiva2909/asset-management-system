import { useEffect, useState } from "react";
import { getEmployees } from "../../services/employeeService";
import { Users } from "lucide-react";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getEmployees();

        console.log("Employee API Response:", response);

        if (response.success) {
          setEmployees(response.data || []);
        } else {
          setError("Employee data not found");
        }
      } catch (err) {
        console.error("Employee API Error:", err);

        setError(err.response?.data?.message || "Unable to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        {/* HEADER - Upar shift kiya aur Maintenance ki tarah highlight kiya */}
        <div className="-mt-8 sm:-mt-10">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-1.5 text-blue-700">
              <Users size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 sm:text-xl">
                Employees
              </h1>
              <p className="text-[11px] text-slate-500">Employee information</p>
            </div>
          </div>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-center">
            <p className="text-xs text-slate-500">Loading employees...</p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-xs font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* EMPLOYEE DATA */}

        {!loading && !error && (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                      ID
                    </th>

                    <th className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                      Employee ID
                    </th>

                    <th className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                      Employee Name
                    </th>

                    <th className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                      Employee Code
                    </th>

                    <th className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                      Department
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-[11px] text-slate-600">
                        {employee.id}
                      </td>

                      <td className="px-3 py-2 text-[11px] font-medium text-slate-800">
                        {employee.empid}
                      </td>

                      <td className="px-3 py-2 text-[11px] font-medium text-slate-800">
                        {employee.emp_name}
                      </td>

                      <td className="px-3 py-2 text-[11px] text-slate-600">
                        {employee.emp_code}
                      </td>

                      <td className="px-3 py-2 text-[11px] text-slate-600">
                        {employee.emp_dept}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* NO DATA */}

            {employees.length === 0 && (
              <div className="p-5 text-center">
                <p className="text-xs text-slate-500">No employees found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
