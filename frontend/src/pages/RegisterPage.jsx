import React, { useState } from 'react';
import { Link, useNavigate } from 'react-window';
import { useNavigate as useNav } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', address: '', phone: '' });
  const [error, setError] = useState('');
  const navigate = useNav();