import { useContext, useState } from "react";
import { User, UserContext } from "../../context/auth";
import Button from "../../components/Button";
import { RmaApiService } from "../../api/RMA.Service";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });
  const [success, setSuccess ] = useState(false)
  const { setUser, setToken } = useContext(UserContext);

  const navigate = useNavigate()

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInput({
      ...loginInput,
      email: e.target.value,
    });
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInput({
      ...loginInput,
      password: e.target.value,
    });
  };

  const onLogin = async () => {
 
    if (loginInput.email && loginInput.password) {
      const res = await RmaApiService.login({
        email: loginInput.email,
        password: loginInput.password,
      });
      
      if( res ) {
 
        setSuccess(true)
        await setUser(
            res.me
        )
        await setToken({
            access_token: res.access_token,
            token_type: res.token_type
        })

        await localStorage.setItem('me', JSON.stringify(res.me))
        await localStorage.setItem('token', JSON.stringify({
            access_token: res.access_token,
            token_type: res.token_type
        }))
        
        navigate('/')
      }

    }
  };
  return (
    <div>
      <div className="w-[25rem] h-[15rem] p-4 mx-auto border-[1px] rounded-lg flex flex-col gap-2 justify-center items-center">
        <label>Email</label>
        <input
          className="w-full rounded-sm text-black"
          placeholder="Email"
          onChange={onChangeEmail}
        />
        <label>Senha</label>
        <input
          className="w-full rounded-sm text-black"
          placeholder="Senha"
          type="password"
          onChange={onChangePassword}
        />
        <Button text="Login" onClickBtn={onLogin} />
      </div>

      { success && (
        <div>
          <h3>Bem vindo, {loginInput.email}.</h3>
          <p>Estamos lhe redericionando.</p>
        </div>
      )}
    </div>
  );
}
