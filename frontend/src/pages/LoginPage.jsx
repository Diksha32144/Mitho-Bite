import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

export default function LoginPage(){
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();


const handleLogin = async (e) =>{
    e.preventDefault();
    setError('');
    try
}









}