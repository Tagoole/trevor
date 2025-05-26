import React from 'react';
import './Issuemanagement.css';

const Issuemanagement = () => {
  const mockIssues = [
    { id: 1, title: "Course Registration Issue", category: "Registration", status: "Open", date: "2024-01-15" },
    { id: 2, title: "Missing Grades", category: "Academic", status: "In Progress", date: "2024-01-14" },
    { id: 3, title: "Signin Problem", category: "Technical", status: "Resolved", date: "2024-01-13" },
  ];

  const getStatusStyle = (status) => {
    switch(status.toLowerCase()) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-8 pl-12 pr-12 bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Issue Management</h1>
          <Button className="new-issue-btn">
            <FiPlus size={20} />
            New Issue
          </Button>
        </div>

        <Card className="rounded-xl shadow-lg border border-gray-200 bg-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="search-bar input">
                <Input
                  placeholder="Search issues..."
                  className="pl-10 pr-4 py-2.5 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-4">Issue</TableHead>
                    <TableHead className="font-semibold text-gray-700">Category</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockIssues.map((issue) => (
                    <TableRow key={issue.id} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{issue.title}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-600">{issue.category}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(issue.status)}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-gray-600">{issue.date}</td>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Issuemanagement;
