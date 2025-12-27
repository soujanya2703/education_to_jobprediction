import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import './header.css'

const ComponentName = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <section className="h-wrapper">
      <div className="flexCenter paddings innerWidth h-container">
        <Link to="/">
          <img src='./logo.png' width={100} />
        </Link>
        <div className="flexCenter h-menu">
          <a href="/#community"><h3>Community</h3></a>
          <a href=""><h3>Job Predictor</h3></a>
          {user ? (
            <>
              <Link to="/dashboard"><h3>Dashboard</h3></Link>
              <button className='button' onClick={logoutUser}>Signup</button>
            </>
          ) : (
            <Link to="/register"><button className='button'>Getting Started</button></Link>
          )}



        </div>
      </div>
    </section>
  )
}

export default ComponentName
