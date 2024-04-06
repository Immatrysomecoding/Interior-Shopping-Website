import { createAxios } from "../../createInstance";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../redux/apiRequest";
import { loginSuccess } from "../../redux/authSlice";
import CountUp from 'react-countup';
const AdminHonme = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const revenue = useSelector((state) => state.revenue?.revenue)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {

    if (!user) {
      navigate("/login");
    }
    if (user?.accessToken) {

      getAllUsers(user?.accessToken, dispatch, axiosJWT);
    }
  }, []);

  return (
    <>
      <div>
        <span>Số đơn đặt hàng:</span> <CountUp start={0} end={revenue[0].order} duration={5} />
      </div>
      <div>
        <span>Số đơn đã bán:</span> <CountUp start={0} end={revenue[0].sale} duration={5} />
      </div>
      <div>
        <span>Tổng doanh thu:</span> <CountUp start={0} end={revenue[0].total} duration={5} />
      </div>
    </>
  );
}

export default AdminHonme;