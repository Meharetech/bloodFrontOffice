import React, { useEffect, useState } from 'react';
import './styles/Hero.css';
import { Link } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Accordion from 'react-bootstrap/Accordion';
import { FaHeartbeat, FaHandHoldingHeart, FaTint } from 'react-icons/fa';
import { Nav } from 'react-bootstrap';
import whydonate from '../components/images/whyDonate.jpeg'

const Hero = () => {
  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="hero-container" data-aos="fade-left">
      {/* <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 items-center justify-between p-10 sm:p-24">
       */}
      <div className='flex flex-col items-center sm:flex-row justify-evenly'
      // 'items-center justify-between p-10 sm:p-24'      
      >
        {/* <div className="ml-2 mr-2 mt-2"> */}
        {/* <Nav.Link as={Link} to="/bloodRequirement" className="w-60 bg-red-500 text-white rounded-2xl animate-blink mb-8">
            Post Blood Requirement
          </Nav.Link>
          <Nav.Link as={Link} to="/volunteervechile" className="w-60 bg-yellow-300 hover:bg-yellow-400 rounded-2xl">
            Volunteer Vehicle
          </Nav.Link>
        </div> */}
        <div className="w-4/5 sm:w-2/5 mt-10">
          <img src={whydonate} alt="whyDonateImage" className='w-full h-full' />
        </div>
        <div className="w-4/5 sm:w-2/5 mt-10">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <FaTint className="mr-2 text-red-600" /> Eligibility to Donate Blood
              </Accordion.Header>
              <Accordion.Body>
                <ul className="list-disc pl-6">
                  <li>Minimum age to donate blood: 18 years</li>
                  <li>Minimum weight: 50 kg (110 lbs)</li>
                  <li>Donation frequency: Every 56 days for whole blood</li>
                  <li>Healthy with no major medical conditions</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <FaHeartbeat className="mr-2 text-red-600" /> Blood Group Compatibility
              </Accordion.Header>
              <Accordion.Body>
                <h4 className="text-lg font-semibold mb-2">Who can donate to whom?</h4>
                <div className="overflow-auto">
                  <table className="table-auto w-full border-collapse">
                    <thead>
                      <tr className="bg-red-200">
                        <th className="border p-2 text-red-800">Blood Type</th>
                        <th className="border p-2 text-red-800">Can Donate To</th>
                        <th className="border p-2 text-red-800">Can Receive From</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2">O-</td>
                        <td className="border p-2">All blood types (Universal Donor)</td>
                        <td className="border p-2">O-</td>
                      </tr>
                      <tr>
                        <td className="border p-2">O+</td>
                        <td className="border p-2">O+, A+, B+, AB+</td>
                        <td className="border p-2">O+, O-</td>
                      </tr>
                      <tr>
                        <td className="border p-2">A-</td>
                        <td className="border p-2">A-, A+, AB-, AB+</td>
                        <td className="border p-2">A-, O-</td>
                      </tr>
                      <tr>
                        <td className="border p-2">A+</td>
                        <td className="border p-2">A+, AB+</td>
                        <td className="border p-2">A+, A-, O+, O-</td>
                      </tr>
                      <tr>
                        <td className="border p-2">B-</td>
                        <td className="border p-2">B-, B+, AB-, AB+</td>
                        <td className="border p-2">B-, O-</td>
                      </tr>
                      <tr>
                        <td className="border p-2">B+</td>
                        <td className="border p-2">B+, AB+</td>
                        <td className="border p-2">B+, B-, O+, O-</td>
                      </tr>
                      <tr>
                        <td className="border p-2">AB-</td>
                        <td className="border p-2">AB-, AB+</td>
                        <td className="border p-2">AB-, A-, B-, O-</td>
                      </tr>
                      <tr>
                        <td className="border p-2">AB+</td>
                        <td className="border p-2">AB+ (Universal Receiver)</td>
                        <td className="border p-2">All blood types</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <FaHandHoldingHeart className="mr-2 text-red-600" /> Benefits of Donating Blood
              </Accordion.Header>
              <Accordion.Body>
                <ul className="list-disc pl-6">
                  <li>Helps save lives by providing essential blood to those in need</li>
                  <li>Reduces the risk of heart disease by improving blood flow</li>
                  <li>Promotes healthy cell regeneration and improves cardiovascular health</li>
                  <li>Burns calories and can help with weight maintenance</li>
                  <li>Psychological benefits, including the feeling of helping others</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Hero;
