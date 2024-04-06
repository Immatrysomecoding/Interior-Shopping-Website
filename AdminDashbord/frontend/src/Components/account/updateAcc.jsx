import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { accUp } from "../../redux/apiRequest";
const UpdateAcc = () => {
  const account = useSelector((state) => state.users?.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  const handleEdit = (e) => {
    e.preventDefault();
    const info = {
      _id: account._id,
      email: email,
      address: address,
      name: name,

    };
    accUp(info, navigate, dispatch);

  }
  useEffect(() => {
    setName(account.name);
    setAddress(account.address);
    setEmail(account.email);
  }, [])

  return (
    <div className="main">
      <p className="sign" align="center">
        Chỉnh sửa thông tin người dùng
      </p>
      <section >

        <form className="form1" onSubmit={handleEdit}>

          <input
            className="username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="username"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="username"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />




          <button className="submit" align="center" type="submit" > Cập nhật</button>
        </form>



      </section>
    </div>
  );

}

export default UpdateAcc;