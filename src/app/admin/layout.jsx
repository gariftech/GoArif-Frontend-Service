import localFont from "next/font/local";
import {Plus_Jakarta_Sans} from 'next/font/google';
import Sidebar from '../../components/SideBar';
import SvgChartSquare from '../../assets/svgComponents/SvgChartSquare';
import SvgLaptop from '../../assets/svgComponents/SvgLaptop';
import SvgGlobe from '../../assets/svgComponents/SvgGlobe';
import SvgPhoneCall from '../../assets/svgComponents/SvgPhoneCall';


import SvgUser from '../../assets/svgComponents/SvgUser';


import SvgHome from '../../assets/svgComponents/SvgHome';
import SvgAttach from '../../assets/svgComponents/SvgAttach';
import SvgReport from '../../assets/svgComponents/SvgReport';
import SvgWrench from '../../assets/svgComponents/SvgWrench';


import NavBar from '../../components/NavBar';

const sidebarMenu = [
  {
    title: 'Home',
    path: '/admin',
    icon: <SvgHome className="stroke-primary" />,
  },
  {
    title: 'Questioner',
    path: '/admin/visualizationtool',
    icon: <SvgChartSquare className="stroke-primary" />,
    disabled: false,
  },
  {
    title: 'Upload',
    path: '/admin/dataupload',
    icon: <SvgAttach className="stroke-primary" />,
    disabled: false,
  },
  {
    title: 'Analysis',
    path: '/admin/analysistool',
    icon: <SvgChartSquare className="stroke-primary" />,
    disabled: false,
  },
  {
    title: 'Report',
    path: '/admin/report',
    icon: <SvgReport className="stroke-primary" />,
    disabled: false,
  },
  {
    title: 'Setting',
    path: '/admin/setting',
    icon: <SvgWrench className="stroke-primary" />,
    disabled: false,
  },
  // {
  //   title: 'Support',
  //   path: '/admin/help',
  //   icon: <SvgPhoneCall className="stroke-primary" />,
  //   disabled: false,
  // },
  // {
  //   title: 'Twilmeet',
  //   icon: <SvgTwilmeetIcon />,
  //   disabled: false,
  //   menuChild: [
  //     // {title: 'Calendar', path: '/admin/twilmeet/calendar'},
  //     // {title: 'Webinar / Class', path: '/admin/twilmeet/webinar'},
  //     // {title: 'Revenue', path: '/admin/twilmeet/revenue'},
  //   ],
  // },
  {
    // title: 'Account',
    // // path: '/admin/account',
    // icon: <SvgUser className="stroke-primary" />,
  },
];

export default function AdminLayout({ children }) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="min-h-dvh flex flex-col">
          <NavBar title={"Dashboard"} />
          <main className="flex flex-grow px-3 pt-3 pb-6">{children}</main>
        </div>
      </div>
      <Sidebar menus={sidebarMenu} />
    </div>
  );
}
