import { useState, type ChangeEvent, type FC, type JSX, type FormEvent } from 'react'
import AlertDialog from './AlertDialog'
import type { IAlertInfo } from '../utils/types'
import type { ILogin, ISignup } from '../utils/types';
import { handleLogin, handleSignup } from '../services/authServices';
import { useNavigate } from 'react-router-dom';

const AuthPage: FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [signupPayload, setSignupInfo] = useState<ISignup>({
    emailId: 'test@gmail.com',
    password: 'Test@123',
    confirmPassword: 'Test@123'
  });
  const [loginPayload, setLoginInfo] = useState<ILogin>({
    emailId: 'test@gmail.com',
    password: 'Test@123'
  });

  const [alert, setAlert] = useState<IAlertInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const handleFormDataChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginInfo(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setSignupInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  const handleFormSubmit = async(e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const response = await (isLogin ? handleLogin(loginPayload) : handleSignup(signupPayload));
      setAlert({ isError: false, message: String(response) });
      navigate("/url/");
    } catch (error: any) {
      console.error(error);
      setAlert({ isError: true, message: String(error ?? 'An error occurred') });
    } finally {
      setLoading(false);
    }
  }


  return (
    <div>
      {alert && <AlertDialog {...alert} />}
  <form onSubmit={handleFormSubmit}>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend text-xl">{isLogin? "Login": "Signup"}</legend>

        <legend className="fieldset-legend">Email</legend>
        <label className="input validator">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </g>
          </svg>
          <input name="emailId" type="email" placeholder="emailId" required onChange={handleFormDataChange} value={isLogin ? loginPayload.emailId : signupPayload.emailId} />
        </label>
        <div className="validator-hint hidden">Enter valid email address</div>

      <legend className="fieldset-legend">Password</legend>
      <label className="input validator">
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
            ></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </g>
        </svg>
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          minLength={8}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
          onChange={handleFormDataChange}
          value={isLogin ? loginPayload.password : signupPayload.password}
        />
      </label>
      <p className="validator-hint hidden">
        Must be more than 8 characters, including
        <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
      </p>

        {
          !isLogin && (
            <div>
              <legend className="fieldset-legend">Confirm Password</legend>
              <label className="input validator">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                  ></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm Password"
                minLength={8}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                onChange={handleFormDataChange}
                value={signupPayload.confirmPassword}
              />
            </label>
            <p className="validator-hint hidden">
              Must be more than 8 characters, including
              <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
            </p>
            </div>
          )
        }

  <h5 className='flex justify-center cursor-pointer' onClick={(): void => setIsLogin((prev) => !prev)}>{isLogin? "Not registered? Signup": "Already registered? Login"}</h5>

  <button type="submit" className="btn btn-neutral mt-4">{isLogin? "Login": "Signup"}</button>

  {loading && <p className="mt-2">Loading...</p>}
  
      </fieldset>
    </form>
  </div>
  )
}

export default AuthPage