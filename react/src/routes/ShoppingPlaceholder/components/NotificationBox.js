import React from 'react';
import Card from 'components/content/Card';
import NotificationForm from './NotificationForm';
import { getUserSubscribed } from 'redux/actions/userActions';
import { showInfoModal } from 'redux/actions/infoModalActions';
import { connect } from 'react-redux';
import './NotificationBox.scss';

const NotificationBox = ({ getUserSubscribed, showInfoModal }) => {
	const handleSubmit = ({ email }) => {
		getUserSubscribed({
			first_name: '',
			last_name: '',
			email
		}).then(data => {
			if (data.payload.status === 200 && data.payload.data === 'subscribed')
				showInfoModal('Thanks!', 'We\'ll send you an email when the new shopping experience is ready');
			else
				showInfoModal('Error', data.payload.message.message);
		});
	};

	return (
		<Card className="notification-box">
			<h2>Keep me posted</h2>
			<p>We'll let you know when the new shopping experience is live</p>
			<NotificationForm onSubmit={handleSubmit} />

			<div className="notification-box-address">
				<p>AUTOLIFE // 50 Leek Crescent / Suite 2B / Richmond Hill, ON / L4B 4J3</p>
			</div>
		</Card>
	);
};
 
export default connect(null, { getUserSubscribed, showInfoModal })(NotificationBox);