// src/app/admin/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import StatsCard from '@/app/components/admin/dashboard/StatsCard';
import ChartCard from '@/app/components/admin/dashboard/ChartCard';
import ActivityList from '@/app/components/admin/dashboard/ActivityList';

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    owners: 0,
    seekers: 0,
    totalProperties: 0,
    totalInquiries: 0,
    activeProperties: 0,
    pendingInquiries: 0,
    completedInquiries: 0,
    recentActivities: [],
    monthlyStats: {
      users: [],
      properties: [],
      inquiries: []
    },
    popularLocations: [],
    propertyTypes: {
      PG: 0,
      FLAT: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
      return;
    }
    fetchDashboardStats();
  }, [timeRange, router]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const responses = await Promise.all([
        fetch(`/api/admin/stats/users?timeRange=${timeRange}`),
        fetch(`/api/admin/stats/properties?timeRange=${timeRange}`),
        fetch(`/api/admin/stats/inquiries?timeRange=${timeRange}`),
        fetch(`/api/admin/stats/activities`)
      ]);
  
      const results = await Promise.all(
        responses.map(async (res) => {
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to fetch data');
          }
          return res.json();
        })
      );
  
      const [usersData, propertiesData, inquiriesData, activitiesData] = results;
  
      setStats({
        totalUsers: usersData.totalUsers || 0,
        owners: usersData.owners || 0,
        seekers: usersData.seekers || 0,
        totalProperties: propertiesData.totalProperties || 0,
        activeProperties: propertiesData.activeProperties || 0,
        totalInquiries: inquiriesData.totalInquiries || 0,
        pendingInquiries: inquiriesData.pendingInquiries || 0,
        completedInquiries: inquiriesData.completedInquiries || 0,
        recentActivities: activitiesData.activities || [],
        monthlyStats: {
          users: usersData.monthlyStats?.users || [],
          properties: propertiesData.monthlyStats?.properties || [],
          inquiries: inquiriesData.monthlyStats?.inquiries || []
        },
        popularLocations: propertiesData.popularLocations || [],
        propertyTypes: propertiesData.propertyTypes || { PG: 0, FLAT: 0 }
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      setError(error.message || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
            <button
              onClick={fetchDashboardStats}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            subStats={{
              Owners: stats.owners,
              Seekers: stats.seekers
            }}
            icon={
              <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />

          <StatsCard
            title="Properties"
            value={stats.totalProperties}
            subStats={{
              Active: stats.activeProperties,
              Pending: stats.totalProperties - stats.activeProperties
            }}
            icon={
              <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
          />

          <StatsCard
            title="Inquiries"
            value={stats.totalInquiries}
            subStats={{
              Pending: stats.pendingInquiries,
              Completed: stats.completedInquiries
            }}
            icon={
              <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            }
          />

          <StatsCard
            title="Response Rate"
            value={`${((stats.completedInquiries / stats.totalInquiries) * 100).toFixed(1)}%`}
            icon={
              <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="User Growth">
            <Line
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                  label: 'Users',
                  data: stats.monthlyStats.users,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                }
              }}
            />
          </ChartCard>

          <ChartCard title="Property Types">
            <Bar
              data={{
                labels: ['PG', 'Flat'],
                datasets: [{
                  label: 'Properties',
                  data: [stats.propertyTypes.PG, stats.propertyTypes.FLAT],
                  backgroundColor: [
                    'rgba(53, 162, 235, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                  ],
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                }
              }}
            />
          </ChartCard>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <ActivityList activities={stats.recentActivities} />
        </div>

        {/* Popular Locations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Popular Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.popularLocations.map((location, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-medium">{location.name}</h3>
                <p className="text-sm text-gray-500">{location.count} properties</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}