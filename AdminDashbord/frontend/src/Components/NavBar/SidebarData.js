import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import *  as BsIcons from 'react-icons/bs'
export const SidebarData = [
  {
    title: 'Tài khoản người dùng',
    path: '/account',
    icon: <BsIcons.BsFillPeopleFill/>,
    cName: 'nav-text'
  },
  {
    title: 'Sản phẩm',
    path: '/product',
    icon: <AiIcons.AiFillDatabase />,
    cName: 'nav-text'
  },
  {
    title: 'Danh mục',
    path: '/category',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },
  {
    title: 'Đặt hàng',
    path: '/productOrder',
    icon: <FaIcons.FaCartPlus/>,
    cName: 'nav-text'
  },
  {
    title: 'Duyệt bài',
    path: '/messages',
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: 'nav-text'
  },
  {
    title: 'Đồ thị doanh số',
    path: '/chart',
    icon: <AiIcons.AiOutlineAreaChart />,
    cName: 'nav-text'
  },
  {
    title: 'Hỗ trợ',
    path: '/support',
    icon: <IoIcons.IoMdHelpCircle />,
    cName: 'nav-text'
  }
];
