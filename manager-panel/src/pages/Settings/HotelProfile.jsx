import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import '../../styles/settings.scss';

const HotelProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Hotel Grand Palace',
    location: 'Udaipur, Rajasthan',
    email: 'contact@grandpalace.com',
    phone: '9876543210',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Profile:', profile);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      alert('Passwords do not match');
      return;
    }
    console.log('Password changed:', passwords);
  };

  return (
    <div className="settings-section">
      <h2>⚙️ Hotel Settings</h2>
      <Row className="g-4">
        <Col md={6}>
          <Card className="p-3">
            <h4>🏨 Hotel Profile</h4>
            <Form onSubmit={handleProfileSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Hotel Name</Form.Label>
                <Form.Control type="text" name="name" value={profile.name} onChange={handleProfileChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control type="text" name="location" value={profile.location} onChange={handleProfileChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={profile.email} onChange={handleProfileChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" name="phone" value={profile.phone} onChange={handleProfileChange} />
              </Form.Group>

              <Button type="submit" variant="primary">Update Profile</Button>
            </Form>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3">
            <h4>🔐 Change Password</h4>
            <Form onSubmit={handlePasswordSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control type="password" name="current" value={passwords.current} onChange={handlePasswordChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" name="newPass" value={passwords.newPass} onChange={handlePasswordChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} required />
              </Form.Group>

              <Button type="submit" variant="success">Update Password</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HotelProfile;
