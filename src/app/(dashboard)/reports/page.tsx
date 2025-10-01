"use client";

import { useEffect, useState } from "react";
import {
  FaFilter,
  FaDownload,
  FaFilePdf,
  FaFileCsv,
  FaFileExcel,
  FaCalendarAlt,
  FaPrint,
  FaChartBar,
  FaSearch,
  FaSync,
} from "react-icons/fa";

interface Compliant {
    id: string,
    date: string,
    category: string;
    description: string;
    location: string;
    urgency: string;
    status: string;
    technician: string;
    resolutionTime: string;
}

interface ReportData {
    title: string;
    description: string;
    headers: string[];
    rows: string[][];   
}

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    start: "2023-10-01",
    end: "2023-10-31"
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [technicianFilter, setTechnicianFilter] = useState("all");
  const [reportType, setReportType] = useState("summary");
  const [isLoading, setIsLoading] = useState(false)
  const [allCompliants, setAllCompliants] = useState<Compliant[]>([])
  const [filteredCompliants, setFilteredCompliants]= useState<Compliant[]>([])

//   sample compliaant data

const sampleCompliants: Compliant[] = [
     { id: "C-1025", date: "2023-10-15", category: "Water Quality", description: "Brown water coming from taps", location: "Downtown District", urgency: "High", status: "Resolved", technician: "Alex Johnson", resolutionTime: "22h" },
    { id: "C-1026", date: "2023-10-15", category: "Pipe Leak", description: "Water leaking from main pipe", location: "5th Street", urgency: "Critical", status: "In Progress", technician: "Maria Garcia", resolutionTime: "18h" },
    { id: "C-1027", date: "2023-10-16", category: "Low Pressure", description: "Low water pressure in morning", location: "Northwest Area", urgency: "Medium", status: "Resolved", technician: "David Chen", resolutionTime: "30h" },
    { id: "C-1028", date: "2023-10-16", category: "No Water", description: "No water supply for 12 hours", location: "Eastern Suburbs", urgency: "High", status: "Pending", technician: "Unassigned", resolutionTime: "-" },
    { id: "C-1029", date: "2023-10-17", category: "Sewage Issue", description: "Sewage mixing with water", location: "Old Town", urgency: "Critical", status: "In Progress", technician: "Sarah Williams", resolutionTime: "26h" },
    { id: "C-1030", date: "2023-10-17", category: "Water Quality", description: "Odd taste in drinking water", location: "Central District", urgency: "Medium", status: "Resolved", technician: "Alex Johnson", resolutionTime: "20h" },
    { id: "C-1031", date: "2023-10-18", category: "Pipe Leak", description: "Minor leak in apartment", location: "Westside", urgency: "Low", status: "Resolved", technician: "David Chen", resolutionTime: "15h" },
    { id: "C-1032", date: "2023-10-18", category: "Water Quality", description: "Discolored water", location: "South District", urgency: "Medium", status: "Pending", technician: "Unassigned", resolutionTime: "-" },
    { id: "C-1033", date: "2023-10-19", category: "Low Pressure", description: "Weak water flow", location: "North Hills", urgency: "Low", status: "Resolved", technician: "Maria Garcia", resolutionTime: "24h" },
    { id: "C-1034", date: "2023-10-20", category: "No Water", description: "Complete water outage", location: "Eastgate", urgency: "Critical", status: "In Progress", technician: "Alex Johnson", resolutionTime: "12h" },
]

// Intialize data
useEffect(() => {
    setAllCompliants(sampleCompliants)
    setFilteredCompliants(sampleCompliants)
}, [])

// apply filters whenever any filter changes
useEffect(() => {
    filterCompliants()
}, [statusFilter, categoryFilter, urgencyFilter, technicianFilter, dateRange, allCompliants])

// filter compliant based on selected criteria
const filterCompliants = () =>{
    setIsLoading(true)

    // simulate api call delay
    setTimeout(() => {
        let filtered = [...allCompliants]

        // filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter(compliant =>
               compliant.status.toLowerCase() === statusFilter.toLowerCase() 
            )
        }

        // filter by category
        if(categoryFilter !== "all") {
            filtered = filtered.filter(compliant => 
                compliant.category.toLowerCase().replace(" ", "-") === categoryFilter
            )
        }
        // filter by uregency
        if(urgencyFilter !== "all"){
            filtered = filtered.filter(compliant => 
                compliant.urgency.toLowerCase() === urgencyFilter.toLowerCase()
            )
        }
        // filter by technician
        if(technicianFilter !== "all") {
            if(technicianFilter === "unassigned") {
                filtered = filtered.filter(compliant =>
                    compliant.technician === "Unassigned"
                )
            } else {
                filtered = filtered.filter(compliant =>
                    compliant.technician.toLowerCase().includes(technicianFilter.toLowerCase())
                )
            }
        }

        // filter by range
        filtered = filtered.filter(compliant => {
            const compliantDate = new Date(compliant.date)
            const startDate = new Date(dateRange.start)
            const endDate = new Date(dateRange.end)
            return compliantDate >= startDate && compliantDate <= endDate
        })

        setFilteredCompliants(filtered)
        setIsLoading(false)
    }, 500)
}
  // Generate report data based on filtered complaints
  const generateReportData = (): ReportData => {
    if (reportType === "summary") {
      const total = filteredCompliants.length;
      const resolved = filteredCompliants.filter(c => c.status === "Resolved").length;
      const pending = filteredCompliants.filter(c => c.status === "Pending").length;
      const inProgress = filteredCompliants.filter(c => c.status === "In Progress").length;
      const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : "0.0";
      
      // Calculate average resolution time (only for resolved complaints with valid time)
      const resolvedWithTime = filteredCompliants.filter(c => 
        c.status === "Resolved" && c.resolutionTime !== "-" && c.resolutionTime !== ""
      );
      const totalResolutionTime = resolvedWithTime.reduce((sum, compliant) => {
        return sum + parseInt(compliant.resolutionTime.replace('h', ''));
      }, 0);
      const avgResolutionTime = resolvedWithTime.length > 0 
        ? (totalResolutionTime / resolvedWithTime.length).toFixed(1) + "h" 
        : "N/A";
      
      return {
        title: "Complaints Summary Report",
        description: "Overview of filtered complaints with key metrics and statistics",
        headers: ["Period", "Total Complaints", "Resolved", "In Progress", "Pending", "Resolution Rate", "Avg. Resolution Time"],
        rows: [
          [`${dateRange.start} to ${dateRange.end}`, total.toString(), resolved.toString(), inProgress.toString(), pending.toString(), `${resolutionRate}%`, avgResolutionTime]
        ]
      };
    } else if (reportType === "detailed") {
      return {
        title: "Detailed Complaints Report",
        description: "Comprehensive list of filtered complaints with complete details",
        headers: ["ID", "Date", "Category", "Description", "Location", "Urgency", "Status", "Technician", "Resolution Time"],
        rows: filteredCompliants.map(compliant => [
          compliant.id,
          compliant.date,
          compliant.category,
          compliant.description,
          compliant.location,
          compliant.urgency,
          compliant.status,
          compliant.technician,
          compliant.resolutionTime
        ])
      };
    } else if (reportType === "performance") {
      // Group by technician and calculate metrics
      const technicianStats: Record<string, { assigned: number, resolved: number, totalTime: number }> = {};
      
      filteredCompliants.forEach(compliant => {
        if (compliant.technician !== "Unassigned") {
          if (!technicianStats[compliant.technician]) {
            technicianStats[compliant.technician] = { assigned: 0, resolved: 0, totalTime: 0 };
          }
          
          technicianStats[compliant.technician].assigned++;
          
          if (compliant.status === "Resolved" && compliant.resolutionTime !== "-") {
            technicianStats[compliant.technician].resolved++;
            technicianStats[compliant.technician].totalTime += parseInt(compliant.resolutionTime.replace('h', ''));
          }
        }
      });
      
      const rows = Object.entries(technicianStats).map(([name, stats]) => {
        const completionRate = stats.assigned > 0 ? ((stats.resolved / stats.assigned) * 100).toFixed(1) : "0.0";
        const avgTime = stats.resolved > 0 ? (stats.totalTime / stats.resolved).toFixed(1) + "h" : "N/A";
        
        return [name, stats.assigned.toString(), stats.resolved.toString(), `${completionRate}%`, avgTime, "4.7/5"];
      });
      
      // Add totals row
      const totalAssigned = Object.values(technicianStats).reduce((sum, stats) => sum + stats.assigned, 0);
      const totalResolved = Object.values(technicianStats).reduce((sum, stats) => sum + stats.resolved, 0);
      const totalCompletionRate = totalAssigned > 0 ? ((totalResolved / totalAssigned) * 100).toFixed(1) : "0.0";
      const totalAvgTime = totalResolved > 0 
        ? (Object.values(technicianStats).reduce((sum, stats) => sum + stats.totalTime, 0) / totalResolved).toFixed(1) + "h" 
        : "N/A";
      
      rows.push(["Overall", totalAssigned.toString(), totalResolved.toString(), `${totalCompletionRate}%`, totalAvgTime, "4.7/5"]);
      
      return {
        title: "Technician Performance Report",
        description: "Performance metrics for technicians based on filtered complaints",
        headers: ["Technician", "Total Assigned", "Completed", "Completion Rate", "Avg. Resolution Time", "Customer Rating"],
        rows
      };
    } else { // category report
      // Group by category and calculate metrics
      const categoryStats: Record<string, { total: number, resolved: number, totalTime: number }> = {};
      
      filteredCompliants.forEach(compliant => {
        if (!categoryStats[compliant.category]) {
          categoryStats[compliant.category] = { total: 0, resolved: 0, totalTime: 0 };
        }
        
        categoryStats[compliant.category].total++;
        
        if (compliant.status === "Resolved" && compliant.resolutionTime !== "-") {
          categoryStats[compliant.category].resolved++;
          categoryStats[compliant.category].totalTime += parseInt(compliant.resolutionTime.replace('h', ''));
        }
      });
      
      const rows = Object.entries(categoryStats).map(([category, stats]) => {
        const resolutionRate = stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : "0.0";
        const avgTime = stats.resolved > 0 ? (stats.totalTime / stats.resolved).toFixed(1) + "h" : "N/A";
        
        return [category, stats.total.toString(), stats.resolved.toString(), (stats.total - stats.resolved).toString(), `${resolutionRate}%`, avgTime];
      });
      
      // Add totals row
      const totalComplaints = Object.values(categoryStats).reduce((sum, stats) => sum + stats.total, 0);
      const totalResolved = Object.values(categoryStats).reduce((sum, stats) => sum + stats.resolved, 0);
      const totalResolutionRate = totalComplaints > 0 ? ((totalResolved / totalComplaints) * 100).toFixed(1) : "0.0";
      const totalAvgTime = totalResolved > 0 
        ? (Object.values(categoryStats).reduce((sum, stats) => sum + stats.totalTime, 0) / totalResolved).toFixed(1) + "h" 
        : "N/A";
      
      rows.push(["Total", totalComplaints.toString(), totalResolved.toString(), (totalComplaints - totalResolved).toString(), `${totalResolutionRate}%`, totalAvgTime]);
      
      return {
        title: "Complaints by Category Report",
        description: "Breakdown of filtered complaints by category and resolution metrics",
        headers: ["Category", "Total Complaints", "Resolved", "Pending", "Resolution Rate", "Avg. Resolution Time"],
        rows
      };
    }
  };

  const currentReport = generateReportData();

  // Handle exporting reports
  const exportReport = (format: string) => {
    // In a real application, this would generate and download the file
    console.log(`Exporting report as ${format}`);
    alert(`Report exported as ${format.toUpperCase()} successfully`);
  };

  // Handle printing reports
  const printReport = () => {
    window.print();
  };

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setUrgencyFilter("all");
    setTechnicianFilter("all");
    setDateRange({
      start: "2023-10-01",
      end: "2023-10-31"
    });
  };

 return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-600">Generate detailed reports and insights</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button 
              onClick={printReport}
              className="bg-white border rounded-md px-3 py-2 flex items-center hover:bg-gray-50"
            >
              <FaPrint className="text-gray-600 mr-1" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Report Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Generate Report</h2>
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FaSync className="mr-1" />
              Reset Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries({
                  summary: "Summary",
                  detailed: "Detailed",
                  performance: "Performance",
                  category: "By Category"
                }).map(([key, label]) => (
                  <button
                    key={key}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      reportType === key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setReportType(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="border rounded-md p-2 w-full"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                />
                <span className="self-center">to</span>
                <input
                  type="date"
                  className="border rounded-md p-2 w-full"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full border rounded-md p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full border rounded-md p-2"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="water-quality">Water Quality</option>
                <option value="pipe-leak">Pipe Leak</option>
                <option value="low-pressure">Low Pressure</option>
                <option value="no-water">No Water</option>
                <option value="sewage-issue">Sewage Issues</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
              <select
                className="w-full border rounded-md p-2"
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
              >
                <option value="all">All Urgency Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technician</label>
              <select
                className="w-full border rounded-md p-2"
                value={technicianFilter}
                onChange={(e) => setTechnicianFilter(e.target.value)}
              >
                <option value="all">All Technicians</option>
                <option value="alex">Alex Johnson</option>
                <option value="maria">Maria Garcia</option>
                <option value="david">David Chen</option>
                <option value="sarah">Sarah Williams</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>
          </div>

          {/* Results Count and Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredCompliants.length}</span> of <span className="font-semibold">{allCompliants.length}</span> complaints
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => exportReport('csv')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                disabled={isLoading}
              >
                <FaFileCsv className="mr-2" />
                Export CSV
              </button>

              <button
                onClick={() => exportReport('pdf')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
                disabled={isLoading}
              >
                <FaFilePdf className="mr-2" />
                Export PDF
              </button>

              <button
                onClick={() => exportReport('excel')}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center"
                disabled={isLoading}
              >
                <FaFileExcel className="mr-2" />
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Report Display */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{currentReport.title}</h2>
                  <p className="text-gray-600">{currentReport.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Period: {dateRange.start} to {dateRange.end}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Generated on: {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Report Table */}
              {filteredCompliants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {currentReport.headers.map((header, index) => (
                          <th
                            key={index}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentReport.rows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className={rowIndex === currentReport.rows.length - 1 ? "bg-gray-50 font-semibold" : ""}
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaSearch className="mx-auto text-4xl text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700">No complaints found</h3>
                  <p className="text-gray-500 mt-1">Try adjusting your filters to see more results.</p>
                </div>
              )}

              {/* Report Summary */}
              {filteredCompliants.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Report Summary</h3>
                  <ul className="text-sm text-blue-700">
                    <li>• Report generated based on current filter criteria</li>
                    <li>• Data reflects complaints from {dateRange.start} to {dateRange.end}</li>
                    <li>• {filteredCompliants.length} complaints match your filters</li>
                    <li>• Export options available for further analysis</li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;