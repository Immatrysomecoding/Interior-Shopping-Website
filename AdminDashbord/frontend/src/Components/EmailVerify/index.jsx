import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import success from "../../images/success.png";
import styles from "./styles.module.css";
import { Fragment } from "react/cjs/react.production.min";

const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState(true);
	const param = useParams();

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `http://localhost:8000/v1/auth/${param.id}/verify/${param.token}`;
				const { data } = await axios.get(url);
				console.log(data);
				setValidUrl(true);
			} catch (error) {
				console.log(error);
				setValidUrl(false);
			}
		};
		verifyEmailUrl();
	}, [param]);

	return (
		<Fragment>
			{validUrl ? (
				<div className={styles.container}>
					<img src={success} alt="success_img" className={styles.success_img} />
					<h1 className="sign">Email verified successfully</h1>
					<div className="flexRow">
						<Link to="/login">
							<button className={styles.green_btn}>Login</button>
						</Link>
						<Link to="/">
							<button className={styles.green_btn}>Home Page</button>
						</Link>
					</div>
				</div>
			) : (

				<h1 className="sign" align="center">404 Not Found</h1>

			)}
		</Fragment>
	);
};

export default EmailVerify;
