const Signup = () => {
  return (
    <div className=''>Signup
    <form>
        <h2>Sign Up</h2>
        <label htmlFor="email">
          Email: 
          <input type="text"></input>
        </label>
        <label htmlFor="password">
          Password:
          <input type="password"></input>
        </label>
        <button>Create Account</button>
        <p>Already Registered? </p>
    </form>
    </div>
  );
};

export default Signup;