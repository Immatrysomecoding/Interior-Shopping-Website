import { useSelector } from "react-redux";


const Info = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  return (
    <div className="main">
      <p className="sign" align="center">
        Thông tin tài khoản Admin
      </p>
      <section >
        <form className="form1" >
          <input
            className="username"
            disabled="true"
            type="text"
            value={user?._id}

          />
          <input
            className="username"
            disabled="true"
            type="text"
            value={user?.username}

          />
          <input
            className="username"
            disabled="true"
            type="text"
            value={user?.email}

          />


        </form>



      </section>
    </div>);
}

export default Info;