import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { authenticatedFetch } from './authService';
import PieChartComponent from '../components/PieChartComponent';

import {
    FaBell,
    FaCalendarAlt,
    FaArrowRight,
    FaChevronLeft,
    FaChevronRight,
    FaArrowUp,
    FaArrowDown,
    FaSearch,
} from 'react-icons/fa';
import { Container, Row, Col, Card, Button, Form, InputGroup, Navbar, Nav, Table, Spinner } from 'react-bootstrap';

/**
 * @component DashboardCard
 * @description A reusable card component for displaying a metric on the dashboard.
 * @param {object} props
 * @param {string} props.title - The title of the metric.
 * @param {string|number} props.value - The main value of the metric.
 * @param {string} props.change - The descriptive text about the change from the last period.
 * @param {boolean} props.isPositive - Indicates if the change is positive or negative.
 */
const DashboardCard = ({ title, value, change, isPositive }) => (
    <Card className="rounded-xl shadow-sm h-100" style={{ backgroundColor: '#dda8a8ff' }}>
        <Card.Body>
            <Card.Title className="mb-1" style={{ fontSize: '1rem', color: '#3c0008' }}>
                {title}
            </Card.Title>
            <Card.Text className="fs-3 fw-bold mb-2">{value}</Card.Text>
            <div className="d-flex align-items-center" style={{ color: isPositive ? '#3c0008' : '#3c0008' }}>
                {/* Conditional rendering for the arrow based on the change value */}
                {change && (
                    <Fragment>
                        {isPositive ? (
                            <FaArrowUp className="me-1" style={{ fontSize: '0.8rem' }} />
                        ) : (
                            <FaArrowDown className="me-1" style={{ fontSize: '0.8rem' }} />
                        )}
                        <span style={{ fontSize: '0.7rem' }}>{change}</span>
                    </Fragment>
                )}
            </div>
        </Card.Body>
    </Card>
);

// Main Dashboard Overview component
// Now accepts userType as a prop (e.g., 'superAdmin' or 'admin')
const DashboardOverview = ({ userType }) => {
    const API_BASE_URL = 'http://127.0.0.1:5000';
    // const API_BASE_URL = process.env.REACT_APP_API_URL;
    
    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState({
        metrics: true,
        chart: true,
        pieChart: true,
        tableData: true,
    });

    const [activeTimePeriod, setActiveTimePeriod] = useState('Month');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [hasUnrepliedMessages, setHasUnrepliedMessages] = useState(0); // Changed to a number for unread count

    // Consolidated state for dashboard metrics - now dynamic values, with initial "constant digits"
    const [dashboardMetrics, setDashboardMetrics] = useState({
        totalVolunteers: { count: 0, change: '...', isPositive: true },
        totalBeneficiaries: { count: 0, change: '...', isPositive: true },
        totalEnrollments: { count: 0, change: '...', isPositive: true },
        totalDonations: { count: '$0', change: '...', isPositive: true }, // Initialized as '$0'
        totalAdmins: { count: 0 }, // This will still be fetched dynamically
        totalPrograms: { count: 0, change: '...', isPositive: true }, // Will be dynamic
        activePrograms: { count: 0, change: '...', isPositive: true }, // Will be dynamic
    });

    const [groupedBarChartData, setGroupedBarChartData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [pieChartData, setPieChartData] = useState([]); // New state for pie chart data
    const [currentChartMonthIndex, setCurrentChartMonthIndex] = useState(0);
    const monthsPerPage = 3;

    // State to hold the raw data fetched from the backend
    const [allVolunteers, setAllVolunteers] = useState([]);
    const [allBeneficiaries, setAllBeneficiaries] = useState([]);
    const [allPrograms, setAllPrograms] = useState([]);
    const [allEnrollments, setAllEnrollments] = useState([]);
    const [allDonations, setAllDonations] = useState([]);

    // State for the Lives Impacted circle value
    const [livesImpactedCircleValue, setLivesImpactedCircleValue] = useState(45);

    // New state to control showing all table data
    const [showAllTableData, setShowAllTableData] = useState(false);


    // --- HELPER FUNCTIONS ---
    const fetchData = useCallback(async (url, dataKey, setter, loadingKey) => {
        setIsLoading(prev => ({ ...prev, [loadingKey]: true }));
        try {
            const response = await authenticatedFetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawData = await response.json();
            const dataArray = rawData[dataKey] || [];
            setter(dataArray);
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
        } finally {
            setIsLoading(prev => ({ ...prev, [loadingKey]: false }));
        }
    }, []);

    // --- API CALLS (EFFECT HOOKS) ---

    // Effect to fetch all dashboard metrics in a single block
    useEffect(() => {
        const fetchAllMetrics = async () => {
            setIsLoading(prev => ({ ...prev, metrics: true }));

            const endpoints = {
                volunteersData: `${API_BASE_URL}/api/v1/volunteers/all`,
                beneficiariesData: `${API_BASE_URL}/api/v1/beneficiaries/all`,
                programsData: `${API_BASE_URL}/api/v1/programs/`,
                enrollmentsData: `${API_BASE_URL}/api/v1/enrollments/all`,
                donationsData: `${API_BASE_URL}/api/v1/donations/all`,
                adminsData: `${API_BASE_URL}/api/v1/admin/all`, // Using the /api/v1/admin/all endpoint
            };

            const metricPromises = Object.entries(endpoints).map(async ([key, url]) => {
                try {
                    const response = await authenticatedFetch(url, { method: 'GET' });
                    if (!response.ok) throw new Error(`Failed to fetch ${key}`);
                    const data = await response.json();
                    return [key, data];
                } catch (error) {
                    console.error(`Error fetching ${key}:`, error);
                    return [key, null];
                }
            });

            const results = await Promise.all(metricPromises);
            const newMetrics = {};

            results.forEach(([key, data]) => {
                if (!data) return;

                if (key === 'volunteersData') {
                    setAllVolunteers(data.volunteers || []);
                } else if (key === 'beneficiariesData') {
                    setAllBeneficiaries(data.beneficiaries || []);
                } else if (key === 'programsData') {
                    setAllPrograms(data.programs || []);
                } else if (key === 'enrollmentsData') {
                    setAllEnrollments(data.enrollments || []);
                } else if (key === 'donationsData') {
                    setAllDonations(data.donations || []);
                } else if (key === 'adminsData') {
                    // Directly update totalAdmins count from fetched data
                    newMetrics.totalAdmins = { count: (data.admins || []).length, change: '...', isPositive: true };
                }
            });

            // Set initial dashboard metrics counts (changes will be calculated in separate effects)
            newMetrics.totalVolunteers = { count: (results.find(res => res[0] === 'volunteersData')?.[1]?.volunteers?.length || 0), change: '...', isPositive: true };
            newMetrics.totalBeneficiaries = { count: (results.find(res => res[0] === 'beneficiariesData')?.[1]?.beneficiaries?.length || 0), change: '...', isPositive: true };
            newMetrics.totalEnrollments = { count: (results.find(res => res[0] === 'enrollmentsData')?.[1]?.enrollments?.length || 0), change: '...', isPositive: true };
            newMetrics.totalPrograms = { count: (results.find(res => res[0] === 'programsData')?.[1]?.programs?.length || 0), change: '...', isPositive: true };
            newMetrics.activePrograms = { count: (results.find(res => res[0] === 'programsData')?.[1]?.programs?.filter(p => p.is_active).length || 0), change: '...', isPositive: true };
            
            // For donations, calculate the total amount if available, otherwise default to 0
            const donationsArray = results.find(res => res[0] === 'donationsData')?.[1]?.donations || [];
            const totalDonationAmount = donationsArray.reduce((sum, donation) => sum + (donation.amount || 0), 0);
            newMetrics.totalDonations = { count: `$${totalDonationAmount.toLocaleString()}`, change: '...', isPositive: true };


            setDashboardMetrics(prev => ({ ...prev, ...newMetrics }));
            setIsLoading(prev => ({ ...prev, metrics: false }));
        };

        fetchAllMetrics();
    }, []); // Empty dependency array means this runs once on mount

    // Effect to calculate volunteer metrics based on all volunteers data
    useEffect(() => {
        if (allVolunteers.length > 0) {
            const now = new Date();
            const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            currentMonthStart.setHours(0, 0, 0, 0);

            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
            lastMonthEnd.setHours(23, 59, 59, 999);

            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            lastMonthStart.setHours(0, 0, 0, 0);

            const currentMonthVolunteers = allVolunteers.filter(v => {
                const joinDate = new Date(v.joined_at);
                return joinDate >= currentMonthStart;
            }).length;

            const lastMonthVolunteers = allVolunteers.filter(v => {
                const joinDate = new Date(v.joined_at);
                return joinDate >= lastMonthStart && joinDate <= lastMonthEnd;
            }).length;

            const totalVolunteersCount = allVolunteers.length;

            let percentageChange = 0;
            let isPositive = true;

            if (lastMonthVolunteers > 0) {
                percentageChange = ((currentMonthVolunteers - lastMonthVolunteers) / lastMonthVolunteers) * 100;
                isPositive = percentageChange >= 0;
            } else if (currentMonthVolunteers > 0) {
                percentageChange = 100;
                isPositive = true;
            } else {
                percentageChange = 0;
                isPositive = true;
            }

            const changeString = `Last Month: ${lastMonthVolunteers}, This Month: ${currentMonthVolunteers} (${percentageChange.toFixed(0)}% ${isPositive ? 'increase' : 'decrease'})`;

            setDashboardMetrics(prev => ({
                ...prev,
                totalVolunteers: {
                    count: totalVolunteersCount,
                    change: changeString,
                    isPositive,
                },
            }));
        }
    }, [allVolunteers]);

    // Effect to calculate beneficiary metrics based on all beneficiaries data
    useEffect(() => {
        if (allBeneficiaries.length > 0) {
            const now = new Date();
            const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            currentMonthStart.setHours(0, 0, 0, 0);

            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
            lastMonthEnd.setHours(23, 59, 59, 999);

            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            lastMonthStart.setHours(0, 0, 0, 0);

            const currentMonthBeneficiaries = allBeneficiaries.filter(b => {
                const createdAt = new Date(b.created_at);
                return createdAt >= currentMonthStart;
            }).length;

            const lastMonthBeneficiaries = allBeneficiaries.filter(b => {
                const createdAt = new Date(b.created_at);
                return createdAt >= lastMonthStart && createdAt <= lastMonthEnd;
            }).length;

            const totalBeneficiariesCount = allBeneficiaries.length;

            let percentageChange = 0;
            let isPositive = true;

            if (lastMonthBeneficiaries > 0) {
                percentageChange = ((currentMonthBeneficiaries - lastMonthBeneficiaries) / lastMonthBeneficiaries) * 100;
                isPositive = percentageChange >= 0;
            } else if (currentMonthBeneficiaries > 0) {
                percentageChange = 100;
                isPositive = true;
            } else {
                percentageChange = 0;
                isPositive = true;
            }

            const changeString = `Last Month: ${lastMonthBeneficiaries}, This Month: ${currentMonthBeneficiaries} (${percentageChange.toFixed(0)}% ${isPositive ? 'increase' : 'decrease'})`;

            setDashboardMetrics(prev => ({
                ...prev,
                totalBeneficiaries: {
                    count: totalBeneficiariesCount,
                    change: changeString,
                    isPositive,
                },
            }));
        }
    }, [allBeneficiaries]);

    // Effect to calculate program metrics based on allPrograms data
    useEffect(() => {
        if (allPrograms.length > 0) {
            const now = new Date();
            const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            currentMonthStart.setHours(0, 0, 0, 0);

            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
            lastMonthEnd.setHours(23, 59, 59, 999);

            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            lastMonthStart.setHours(0, 0, 0, 0);

            const currentMonthPrograms = allPrograms.filter(p => {
                const createdAt = new Date(p.created_at);
                return createdAt >= currentMonthStart;
            }).length;

            const lastMonthPrograms = allPrograms.filter(p => {
                const createdAt = new Date(p.created_at);
                return createdAt >= lastMonthStart && createdAt <= lastMonthEnd;
            }).length;

            const totalProgramsCount = allPrograms.length;
            const activeProgramsCount = allPrograms.filter(p => p.is_active).length;

            let percentageChangeTotal = 0;
            let isPositiveTotal = true;

            if (lastMonthPrograms > 0) {
                percentageChangeTotal = ((currentMonthPrograms - lastMonthPrograms) / lastMonthPrograms) * 100;
                isPositiveTotal = percentageChangeTotal >= 0;
            } else if (currentMonthPrograms > 0) {
                percentageChangeTotal = 100;
                isPositiveTotal = true;
            } else {
                percentageChangeTotal = 0;
                isPositiveTotal = true;
            }

            const changeStringTotal = `Last Month: ${lastMonthPrograms}, This Month: ${currentMonthPrograms} (${percentageChangeTotal.toFixed(0)}% ${isPositiveTotal ? 'increase' : 'decrease'})`;

            setDashboardMetrics(prev => ({
                ...prev,
                totalPrograms: {
                    count: totalProgramsCount,
                    change: changeStringTotal,
                    isPositive: isPositiveTotal,
                },
                activePrograms: {
                    count: activeProgramsCount,
                    change: prev.activePrograms ? prev.activePrograms.change : '...',
                    isPositive: prev.activePrograms ? prev.activePrograms.isPositive : true,
                }
            }));
        }
    }, [allPrograms]);

    // Effect to calculate enrollment metrics based on allEnrollments data
    useEffect(() => {
        if (allEnrollments.length > 0) {
            const now = new Date();
            const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            currentMonthStart.setHours(0, 0, 0, 0);

            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
            lastMonthEnd.setHours(23, 59, 59, 999);

            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            lastMonthStart.setHours(0, 0, 0, 0);

            const currentMonthEnrollments = allEnrollments.filter(e => {
                const enrolledAt = new Date(e.enrolled_at);
                return enrolledAt >= currentMonthStart;
            }).length;

            const lastMonthEnrollments = allEnrollments.filter(e => {
                const enrolledAt = new Date(e.enrolled_at);
                return enrolledAt >= lastMonthStart && enrolledAt <= lastMonthEnd;
            }).length;

            const totalEnrollmentsCount = allEnrollments.length;

            let percentageChange = 0;
            let isPositive = true;

            if (lastMonthEnrollments > 0) {
                percentageChange = ((currentMonthEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100;
                isPositive = percentageChange >= 0;
            } else if (currentMonthEnrollments > 0) {
                percentageChange = 100;
                isPositive = true;
            } else {
                percentageChange = 0;
                isPositive = true;
            }

            const changeString = `Last Month: ${lastMonthEnrollments}, This Month: ${currentMonthEnrollments} (${percentageChange.toFixed(0)}% ${isPositive ? 'increase' : 'decrease'})`;

            setDashboardMetrics(prev => ({
                ...prev,
                totalEnrollments: {
                    count: totalEnrollmentsCount,
                    change: changeString,
                    isPositive,
                },
            }));
        }
    }, [allEnrollments]);

    // Effect to calculate donation metrics based on allDonations data (count, not amount)
    useEffect(() => {
        if (allDonations.length > 0) {
            const now = new Date();
            const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            currentMonthStart.setHours(0, 0, 0, 0);

            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
            lastMonthEnd.setHours(23, 59, 59, 999);

            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            lastMonthStart.setHours(0, 0, 0, 0);

            const currentMonthDonations = allDonations.filter(d => {
                const createdAt = new Date(d.created_at);
                return createdAt >= currentMonthStart;
            }).length;

            const lastMonthDonations = allDonations.filter(d => {
                const createdAt = new Date(d.created_at);
                return createdAt >= lastMonthStart && createdAt <= lastMonthEnd;
            }).length;

            const totalDonationsCount = allDonations.length;

            let percentageChange = 0;
            let isPositive = true;

            if (lastMonthDonations > 0) {
                percentageChange = ((currentMonthDonations - lastMonthDonations) / lastMonthDonations) * 100;
                isPositive = percentageChange >= 0;
            } else if (currentMonthDonations > 0) {
                percentageChange = 100;
                isPositive = true;
            } else {
                percentageChange = 0;
                isPositive = true;
            }

            const changeString = `Last Month: ${lastMonthDonations}, This Month: ${currentMonthDonations} (${percentageChange.toFixed(0)}% ${isPositive ? 'increase' : 'decrease'})`;

            setDashboardMetrics(prev => ({
                ...prev,
                totalDonations: {
                    count: totalDonationsCount,
                    change: changeString,
                    isPositive,
                },
            }));
        }
    }, [allDonations]);


    // Effect to fetch unreplied messages for the notification bell
    useEffect(() => {
        const fetchUnrepliedMessages = async () => {
            try {
                const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/contact/all`);
                const responseData = await response.json();
                const unrepliedCount = (responseData.contact_messages || []).filter(message => message.status === 'pending').length;
                setHasUnrepliedMessages(unrepliedCount);
            } catch (error) {
                console.error('Error fetching unread messages for bell icon:', error);
                setHasUnrepliedMessages(0);
            }
        };
        fetchUnrepliedMessages();
        const intervalId = setInterval(fetchUnrepliedMessages, 30000);
        return () => clearInterval(intervalId);
    }, []);

    // Effect to fetch table data based on user type and showAllTableData state, and apply search filter
    useEffect(() => {
        const tableUrl = userType === 'superAdmin'
            ? '${API_BASE_URL}/api/v1/admin/all'
            : '${API_BASE_URL}/api/v1/volunteers/all'; // Fetch volunteers for 'admin'

        const dataKey = userType === 'superAdmin' ? 'admins' : 'volunteers';

        const fetchTableData = async () => {
            await fetchData(tableUrl, dataKey, (data) => {
                // Sort by creation date if available, otherwise by ID to get "recently added"
                const sortedData = data.sort((a, b) => {
                    // Use 'created_at' for admins and 'joined_at' for volunteers
                    const dateA = new Date(a.created_at || a.joined_at || 0);
                    const dateB = new Date(b.created_at || b.joined_at || 0);
                    return dateB - dateA; // Descending order for recent
                });

                // Apply search filter
                const filteredData = sortedData.filter(item => {
                    const query = searchQuery.toLowerCase();
                    // Assume 'first_name', 'last_name', 'email' fields exist for both admins and volunteers
                    const firstName = item.first_name ? item.first_name.toLowerCase() : '';
                    const lastName = item.last_name ? item.last_name.toLowerCase() : '';
                    const email = item.email ? item.email.toLowerCase() : '';

                    // For admins, 'name' might be the full name, check if it exists and use it if first/last are not present
                    const adminName = item.name ? item.name.toLowerCase() : '';

                    return (
                        firstName.includes(query) ||
                        lastName.includes(query) ||
                        email.includes(query) ||
                        // Include adminName for superAdmin if first/last names aren't always separate
                        (userType === 'superAdmin' && adminName.includes(query))
                    );
                });

                if (showAllTableData) {
                    setTableData(filteredData);
                } else {
                    // Display the most recent 5 filtered items
                    setTableData(filteredData.slice(0, 5));
                }
            }, 'tableData');
        };
        fetchTableData();
    }, [userType, showAllTableData, fetchData, searchQuery]);


    // Effect to generate chart data based on all fetched raw data
    useEffect(() => {
        setIsLoading(prev => ({ ...prev, chart: true }));

        if (!isLoading.metrics) {
            const months = [];
            const today = new Date();
            const currentYear = today.getFullYear();

            // Define constant base values for the chart
            const BASE_LIVES_IMPACTED = 17; // Updated base value
            const BASE_SKILLS_ATTAINED = 9;
            const BASE_DONATIONS = 6;

            for (let i = 0; i < 12; i++) {
                const date = new Date(currentYear, i, 1);
                const monthName = date.toLocaleString('default', { month: 'short' });

                const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
                monthStart.setHours(0, 0, 0, 0);

                let monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                monthEnd.setHours(23, 59, 59, 999);

                // Calculate actual data for *this specific month* (regardless of whether it's the current month)
                const actualMonthlyDonations = (allDonations || [])
                    .filter(d => {
                        const donationDate = new Date(d.created_at);
                        return donationDate >= monthStart && donationDate <= monthEnd;
                    }).length;

                const actualMonthlyVolunteers = (allVolunteers || []).filter(v => {
                    const joinDate = new Date(v.joined_at);
                    return joinDate >= monthStart && joinDate <= monthEnd;
                }).length;

                const actualMonthlyBeneficiaries = (allBeneficiaries || []).filter(b => {
                    const createdAt = new Date(b.created_at);
                    return createdAt >= monthStart && createdAt <= monthEnd;
                }).length;
                const actualMonthlyLivesImpacted = actualMonthlyVolunteers + actualMonthlyBeneficiaries;

                const actualMonthlyPrograms = (allPrograms || []).filter(p => {
                    const createdAt = new Date(p.created_at);
                    return createdAt >= monthStart && createdAt <= monthEnd;
                }).length;

                // Add actual data to the base constants for *each* month
                const monthlyDonationsValue = BASE_DONATIONS + actualMonthlyDonations;
                const monthlyLivesImpactedValue = BASE_LIVES_IMPACTED + actualMonthlyLivesImpacted;
                const monthlySkillsAttainedValue = BASE_SKILLS_ATTAINED + actualMonthlyPrograms;


                months.push({
                    month: monthName,
                    totalDonations: monthlyDonationsValue,
                    livesImpacted: monthlyLivesImpactedValue,
                    skillsAttained: monthlySkillsAttainedValue,
                });
            }

            setGroupedBarChartData(months);
            setIsLoading(prev => ({ ...prev, chart: false }));
        }
    }, [
        isLoading.metrics,
        allDonations,
        allVolunteers,
        allBeneficiaries,
        allPrograms
    ]);

    // Effect to calculate the Lives Impacted circle value based on 45 + total volunteers + total beneficiaries
    useEffect(() => {
        const totalVolunteersAndBeneficiaries = (allVolunteers.length || 0) + (allBeneficiaries.length || 0);
        setLivesImpactedCircleValue(45 + totalVolunteersAndBeneficiaries);
    }, [allVolunteers, allBeneficiaries]);


    // Effect to generate pie chart data from the fetched data
    useEffect(() => {
        setIsLoading(prev => ({ ...prev, pieChart: true }));

        if (!isLoading.metrics) {
            const { totalAdmins } = dashboardMetrics;

            const data = [
                { name: 'Volunteers', value: (allVolunteers || []).length, color: 'rgba(202, 87, 87, 1)' },
                { name: 'Beneficiaries', value: (allBeneficiaries || []).length, color: '#4CAF50' },
                { name: 'Admins', value: parseInt(String(totalAdmins.count).replace(/,/g, '') || '0'), color: '#358ed6ff' },
                { name: 'Programs', value: (allPrograms || []).length, color: '#ffc107' },
                { name: 'Enrollments', value: (allEnrollments || []).length, color: '#9c27b0' },
                { name: 'Donations', value: (allDonations || []).length, color: '#FFD700' },
            ].filter(item => item.value > 0);

            setPieChartData(data);
            setIsLoading(prev => ({ ...prev, pieChart: false }));
        }
    }, [
        isLoading.metrics,
        dashboardMetrics,
        allVolunteers,
        allBeneficiaries,
        allPrograms,
        allEnrollments,
        allDonations
    ]);

    // Function to calculate date range based on activeTimePeriod
    const getDateRange = useCallback(() => {
        const today = new Date();
        let startDate, endDate;

        switch (activeTimePeriod) {
            case 'Day':
                startDate = new Date(today);
                endDate = new Date(today);
                break;
            case 'Week':
                startDate = new Date(today.setDate(today.getDate() - today.getDay()));
                endDate = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                break;
            case 'Month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
            case 'Year':
                startDate = new Date(today.getFullYear(), 0, 1);
                endDate = new Date(today.getFullYear(), 11, 31);
                break;
            default:
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        }

        const formatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return `${startDate.toLocaleDateString('en-US', formatOptions)} - ${endDate.toLocaleDateString('en-US', formatOptions)}`;
    }, [activeTimePeriod]);

    // Helper component for the grouped bar chart
    const GroupedBarChart = ({ data, isLoading, onPrev, onNext, canGoPrev, canGoNext }) => {
        const categories = ['totalDonations', 'livesImpacted', 'skillsAttained'];
        const colors = {
            totalDonations: 'rgba(202, 87, 87, 1)',
            livesImpacted: '#4CAF50',
            skillsAttained: '#358ed6ff',
        };

        // Define a fixed maximum value for the Y-axis
        const fixedMaxChartValue = 30; // You can adjust this value as needed

        if (isLoading) {
            return (
                <Card className="rounded-lg shadow-sm d-flex align-items-center justify-content-center" style={{ height: '256px' }}>
                    <Spinner animation="border" variant="secondary" />
                </Card>
            );
        }

        if (!data || data.length === 0) {
            return (
                <Card className="rounded-lg shadow-sm d-flex align-items-center justify-content-center" style={{ height: '256px' }}>
                    <Card.Text className="text-muted">No chart data available.</Card.Text>
                </Card>
            );
        }

        const chartHeight = 180;
        const groupWidth = 120;
        const barWidth = 23;

        return (
            <Card className="p-4 rounded-lg shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="h5 fw-semibold text-gray-800">Total Donations, Lives Impacted & Skills Attained</h3>
                    <div className="d-flex gap-2">
                        <Button variant="link" className="text-muted" onClick={onPrev} disabled={!canGoPrev}>
                            <FaChevronLeft className="fs-6" />
                        </Button>
                        <Button variant="link" className="text-muted" onClick={onNext} disabled={!canGoNext}>
                            <FaArrowRight className="fs-6" />
                        </Button>
                    </div>
                </div>
                <div className="d-flex align-items-end" style={{ height: '203px', overflowX: 'hidden', paddingBottom: '1rem' }}>
                    <div className="d-flex flex-column justify-content-between h-100 pe-3 text-sm text-muted">
                        {/* Fixed Y-axis labels */}
                        <span>{fixedMaxChartValue}</span>
                        <span>{fixedMaxChartValue * 0.75}</span>
                        <span>{fixedMaxChartValue * 0.5}</span>
                        <span>{fixedMaxChartValue * 0.25}</span>
                        <span>0</span>
                    </div>
                    <div className="d-flex flex-grow-1 justify-content-around align-items-end h-100" style={{ minWidth: 'max-content' }}>
                        {data.map((d, index) => (
                            <div key={index} className="d-flex flex-column align-items-center mx-2" style={{ width: `${groupWidth}px` }}>
                                <div className="d-flex justify-content-center align-items-end w-100" style={{ height: `${chartHeight}px` }}>
                                    {categories.map((cat, i) => (
                                        <div
                                            key={i}
                                            className="rounded-top mx-1"
                                            style={{
                                                height: `${((d[cat] || 0) / fixedMaxChartValue) * chartHeight}px`, // Use fixedMaxChartValue here
                                                width: `${barWidth}px`,
                                                backgroundColor: colors[cat],
                                            }}
                                        ></div>
                                    ))}
                                </div>
                                <span className="text-xs text-muted mt-2">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="d-flex justify-content-center mt-3 text-sm">
                    <div className="d-flex align-items-center me-4">
                        <span className="d-inline-block rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: colors.totalDonations }}></span>
                        Total Donations
                    </div>
                    <div className="d-flex align-items-center me-4">
                        <span className="d-inline-block rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: colors.livesImpacted }}></span>
                        Lives Impacted
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="d-inline-block rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: colors.skillsAttained }}></span>
                        Skills Attained
                    </div>
                </div>
            </Card>
        );
    };

    const Calendar = ({ month, onPrevMonth, onNextMonth }) => {
        const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

        const totalDays = daysInMonth(month);
        const startingDay = firstDayOfMonth(month);
        const datesArray = [];

        for (let i = 0; i < startingDay; i++) {
            datesArray.push(null);
        }
        for (let i = 1; i <= totalDays; i++) {
            datesArray.push(i);
        }

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <Card className="p-4 rounded-lg shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Button variant="link" className="text-muted" onClick={onPrevMonth}>
                        <FaChevronLeft className="fs-6" />
                    </Button>
                    <h3 className="h5 fw-semibold text-gray-800">
                        {month.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <Button variant="link" className="text-muted" onClick={onNextMonth}>
                        <FaChevronRight className="fs-6" />
                    </Button>
                </div>
                <div className="d-grid gap-1 text-center" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {daysOfWeek.map(day => (
                        <div key={day} className="fw-medium text-muted">{day}</div>
                    ))}
                    {datesArray.map((date, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded-lg ${date === null ? 'invisible' : ''} ${
                                date === new Date().getDate() && month.getMonth() === new Date().getMonth() && month.getFullYear() === new Date().getFullYear()
                                    ? 'bg-danger text-white'
                                    : 'text-muted hover:bg-light cursor-pointer'
                            }`}
                        >
                            {date}
                        </div>
                    ))}
                </div>
            </Card>
        );
    };

    const goToPrevMonth = () => setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1));
    const goToNextMonth = () => setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1));

    const goToNextChartPeriod = () => setCurrentChartMonthIndex(prevIndex => Math.min(prevIndex + monthsPerPage, groupedBarChartData.length - monthsPerPage));
    const goToPrevChartPeriod = () => setCurrentChartMonthIndex(prevIndex => Math.max(0, prevIndex - monthsPerPage));

    const visibleChartData = groupedBarChartData.slice(currentChartMonthIndex, currentChartMonthIndex + monthsPerPage);
    const canGoPrevChart = currentChartMonthIndex > 0;
    const canGoNextChart = currentChartMonthIndex + monthsPerPage < groupedBarChartData.length;

    return (
        <Container className="bg-light min-vh-100 py-4 mx-auto" style={{ maxWidth: '1200px' }}>
            <Row className="justify-content-center">
                <Col xs={12}>
                    <Navbar bg="white" expand="lg" className="mb-4 rounded-lg shadow-sm">
                        <Container fluid>
                            <Navbar.Brand className="h2 fw-bold text-dark mb-0">Admin Dashboard</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                                <Nav className="align-items-center">
                                    {/* Search bar */}
                                    <InputGroup className="me-3" style={{ maxWidth: '300px' }}>
                                        <InputGroup.Text className="bg-white border-end-0">
                                            <FaSearch className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder={`Search recent ${userType === 'superAdmin' ? 'admins' : 'volunteers'}...`}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="border-start-0 shadow-none"
                                        />
                                    </InputGroup>
                                    <Button variant="light" className="rounded-circle p-2 me-3 position-relative">
                                        <FaBell className="text-secondary fs-6" />
                                        {hasUnrepliedMessages > 0 && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger border border-light p-1">
                                                <span className="visually-hidden">{hasUnrepliedMessages} new messages</span>
                                            </span>
                                        )}
                                    </Button>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                        {['Day', 'Week', 'Month', 'Year'].map((period) => (
                            <Button
                                key={period}
                                onClick={() => setActiveTimePeriod(period)}
                                variant={activeTimePeriod === period ? 'danger' : 'light'}
                                className="rounded-lg fw-medium"
                            >
                                {period}
                            </Button>
                        ))}
                        <InputGroup className="ms-auto" style={{ maxWidth: '250px' }}>
                            <InputGroup.Text className="bg-white border-0 pe-0">
                                <FaCalendarAlt className="text-muted fs-6" />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                readOnly
                                value={getDateRange()}
                                className="border-0 ps-0 shadow-none"
                            />
                        </InputGroup>
                    </div>

                    <Row xs={1} md={2} lg={4} className="g-4 mb-4">
                        {isLoading.metrics ? (
                            <Col xs={12} className="text-center text-muted py-5">
                                <Spinner animation="border" variant="secondary" />
                            </Col>
                        ) : (
                            <Fragment>
                                <Col>
                                    <DashboardCard
                                        title="Total Volunteers"
                                        value={String(dashboardMetrics.totalVolunteers.count).toLocaleString()}
                                        change={dashboardMetrics.totalVolunteers.change}
                                        isPositive={dashboardMetrics.totalVolunteers.isPositive}
                                    />
                                </Col>
                                <Col>
                                    <DashboardCard
                                        title="Total Beneficiaries"
                                        value={String(dashboardMetrics.totalBeneficiaries.count).toLocaleString()}
                                        change={dashboardMetrics.totalBeneficiaries.change}
                                        isPositive={dashboardMetrics.totalBeneficiaries.isPositive}
                                    />
                                </Col>
                                <Col>
                                    <DashboardCard
                                        title="Total Programs"
                                        value={String(dashboardMetrics.totalPrograms.count).toLocaleString()}
                                        change={dashboardMetrics.totalPrograms.change}
                                        isPositive={dashboardMetrics.totalPrograms.isPositive}
                                    />
                                </Col>
                                <Col>
                                    <DashboardCard
                                        title="Total Enrollments"
                                        value={String(dashboardMetrics.totalEnrollments.count).toLocaleString()}
                                        change={dashboardMetrics.totalEnrollments.change}
                                        isPositive={dashboardMetrics.totalEnrollments.isPositive}
                                    />
                                </Col>
                            </Fragment>
                        )}
                    </Row>

                    <Row className="g-4 mb-4">
                        <Col lg={8}>
                            <GroupedBarChart
                                data={visibleChartData}
                                isLoading={isLoading.chart}
                                onPrev={goToPrevChartPeriod}
                                onNext={goToNextChartPeriod}
                                canGoPrev={canGoPrevChart}
                                canGoNext={canGoNextChart}
                            />
                        </Col>
                        <Col lg={4}>
                            <Calendar
                                month={currentMonth}
                                onPrevMonth={goToPrevMonth}
                                onNextMonth={goToNextMonth}
                            />
                            <Card className="p-4 rounded-lg shadow-sm mt-4">
                                <Card.Title className="h5 fw-semibold mb-3">Lives Impacted</Card.Title>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="position-relative" style={{ width: '80px', height: '80px' }}>
                                        <svg className="w-100 h-100" viewBox="0 0 100 100">
                                            <circle
                                                className="text-secondary"
                                                strokeWidth="10"
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="transparent"
                                                stroke="currentColor"
                                            ></circle>
                                            <circle
                                                className="text-danger"
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="transparent"
                                                strokeDasharray={`${(livesImpactedCircleValue / 100) * 251.2}, 251.2`}
                                                transform="rotate(-90 50 50)"
                                                stroke="currentColor"
                                            ></circle>
                                            <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="fs-4 fw-bold text-dark">
                                                {String(livesImpactedCircleValue).toLocaleString()}
                                            </text>
                                        </svg>
                                    </div>
                                    <div className="text-sm text-muted">
                                        <div className="d-flex align-items-center" style={{ color: '#3c0008' }}>
                                            <FaArrowUp className="me-1" style={{ fontSize: '0.8rem' }} />
                                            Total Lives
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* New Pie Chart Section */}
                    <Row className="g-4 mb-4">
                        <Col lg={6}>
                            {/* This is the new PieChartComponent */}
                            <PieChartComponent data={pieChartData} isLoading={isLoading.pieChart} />
                        </Col>
                        <Col lg={6}>
                            <Card className="p-4 rounded-lg shadow-sm h-100">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h3 className="h5 fw-semibold text-gray-800 mb-0">Recent {userType === 'superAdmin' ? 'Admins' : 'Volunteers'}</h3>
                                    <Button
                                        variant="link"
                                        className="text-decoration-none d-flex align-items-center p-0"
                                        onClick={() => setShowAllTableData(!showAllTableData)}
                                    >
                                        {showAllTableData ? 'View Recent' : 'View All'} <FaArrowRight className="ms-2" />
                                    </Button>
                                </div>
                                {isLoading.tableData ? (
                                    <div className="d-flex justify-content-center align-items-center h-100">
                                        <Spinner animation="border" variant="secondary" />
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <Table hover borderless className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th className="text-muted fw-normal text-sm">First Name</th>
                                                    <th className="text-muted fw-normal text-sm">Last Name</th>
                                                    <th className="text-muted fw-normal text-sm">Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.length > 0 ? (
                                                    tableData.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="fw-medium">{item.first_name || (userType === 'superAdmin' ? item.name : 'N/A')}</td>
                                                            <td>{item.last_name || 'N/A'}</td>
                                                            <td>{item.email || 'N/A'}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="3" className="text-center text-muted">
                                                            {searchQuery !== '' ? 'No results found for your search.' : 'No data available'}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardOverview;
