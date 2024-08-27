import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles/Login.module.css";

import { backendIp } from "../VALUE";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [className, setClassName] = useState("");
  const [parentEducation, setParentEducation] = useState("");
  const [languages, setLanguages] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSignup = async () => {
    if (
      username?.length === 0 || 
      password?.length === 0 || 
      name?.length === 0 || 
      age?.length === 0 || 
      className?.length === 0 || 
      parentEducation?.length === 0 || 
      languages?.length === 0
    ) {
      alert("Please fill in all the required fields");
      return;
    }

    const response = await fetch(`${backendIp}/api/user/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        username, 
        password, 
        name, 
        age, 
        class: className, 
        parentEducation, 
        languages 
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      localStorage.setItem("token", data.id);
      console.log(data);
      alert("Account created successfully. Redirecting...");
      window.location.reload();
    } else {
      const data = await response.json();
      alert(data.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Signup</h1>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <label htmlFor="age">Age</label>
          <input
            type="text"
            id="age"
            name="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          
          <label htmlFor="class">Class</label>
          <input
            type="text"
            id="class"
            name="class"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
          
          <label htmlFor="parentEducation">Educational Qualification of Parents</label>
          <input
            type="text"
            id="parentEducation"
            name="parentEducation"
            value={parentEducation}
            onChange={(e) => setParentEducation(e.target.value)}
          />
          
          <label htmlFor="languages">Spoken Languages</label>
          <input
            type="text"
            id="languages"
            name="languages"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
          />

          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button onClick={handleSignup}>Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
