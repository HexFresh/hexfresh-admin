import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import GroupIcon from '@mui/icons-material/Group';

export const routes = [
  {
    display_name: 'Dashboard',
    route: '/dashboard',
    icon: <DashboardIcon />,
  },
  {
    display_name: 'Mentors',
    route: '/mentors',
    icon: <SupervisedUserCircleIcon />,
  },
  {
    display_name: 'Freshers',
    route: '/freshers',
    icon: <GroupIcon />,
  },
];
