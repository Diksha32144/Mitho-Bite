import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Boxes, 
  LogOut, 
  ArrowLeft, 
  Bell, 
  ChevronDown,
  Loader2,
  CircleDollarSign,
  Clock,
  AlertTriangle
}from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockItems: 0
  })