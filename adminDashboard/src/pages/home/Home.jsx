// Redirects user to login page. The home page contains no content in this project.

const Home = () => {
  // Immediately navigate to login page
  window.location.href = '/login';

  return null; // render nothing
};

export default Home;
