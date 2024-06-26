import {FormEvent, useState} from "react";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {useNavigate} from "react-router-dom";

const Login = () => {
  const [emailModel, setEmailModel] = useState<string>('');
  const [passwordModel, setPasswordModel] = useState<string>('');
  const navigate = useNavigate();
  const emailModelHandler = (value: string): void => {
    setEmailModel(value);
  }
  const passwordModelHandler = (value: string): void => {
    setPasswordModel(value);
  }
    const signinHandler = (event: FormEvent): void => {
    event.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, emailModel, passwordModel)
      .then((): void => {
        navigate("/");
      })
  }

  return(
    <div className="login-wrapper">
          <div className="flex flex-col items-center justify-center mx-auto h-screen lg:py-0">
            <div className="w-full rounded-lg  dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="pb-6 pr-6 pl-6 space-y-4 md:space-y-6 sm:p-8">
                <div className="flex justify-center mb-6">
                  <img src="https://i.pinimg.com/736x/11/94/b9/1194b96640d448cb4f0e6aaa68e998dc.jpg" className="w-16" alt=""/>
                </div>
                <form className="space-y-4 md:space-y-6" onSubmit={(e) => signinHandler(e)}>
                  <div>
                    {/*<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your*/}
                    {/*  email</label>*/}
                    <input type="email" name="email" id="email"
                           className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="Email" required
                           value={emailModel}
                           onChange={(e) => emailModelHandler(e.target.value)}
                    />
                  </div>
                  <div>
                    {/*<label htmlFor="password"*/}
                    {/*       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>*/}
                    <input type="password" name="password" id="password" placeholder="Password"
                           className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           required
                           value={passwordModel}
                           onChange={(e) => passwordModelHandler(e.target.value)}
                    />
                  </div>
                  {/*<div className="flex items-center justify-between">*/}
                    {/*<div className="flex items-start">*/}
                    {/*  <div className="flex items-center h-5">*/}
                    {/*    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />*/}
                    {/*  </div>*/}
                      {/*<div className="ml-3 text-sm">*/}
                      {/*  <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>*/}
                      {/*</div>*/}
                    {/*</div>*/}
                    {/*<a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>*/}
                  {/*</div>*/}
                  <button type="submit" className="text-white w-full bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    Sign in
                  </button>
                  {/*<p className="text-sm font-light text-gray-500 dark:text-gray-400">*/}
                  {/*  Don’t have an account yet?*/}
                  {/*  <a onClick={() => signUpHandler()} className="font-medium text-primary-600 hover:underline dark:text-primary-500"> Sign up</a>*/}
                  {/*</p>*/}
                </form>
              </div>
            </div>
          </div>
    </div>
  )
}

export default Login