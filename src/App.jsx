import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, child } from 'firebase/database';
import './styles.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDemoKeyForAlex123456789",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "ks5physics-demo.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "ks5physics-demo",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "ks5physics-demo.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://ks5physics-demo.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Flashcard definitions data
const FLASHCARD_DATA = {
  1: {
    name: "Measurements and their Errors",
    cards: [
      { id: "1-1", keyword: "Accuracy", definition: "A measure of how close a measurement is to the true value." },
      { id: "1-2", keyword: "Precision", definition: "A measure of how close a measurement is to the mean value. It only gives an indication of the magnitude of random errors, not how close data is to the true value." },
      { id: "1-3", keyword: "Random Error", definition: "Unpredictable variation between measurements that leads to a spread of values about the true value. Random error can be reduced by taking repeat measurements." },
      { id: "1-4", keyword: "Systematic Error", definition: "Causes all readings to differ from the true value by a fixed amount. Systematic error cannot be corrected by repeat readings, instead a different technique or apparatus should be used." },
      { id: "1-5", keyword: "Repeatable", definition: "The same experimenter can repeat a measurement using the same method and equipment and obtain the same value." },
      { id: "1-6", keyword: "Reproducible", definition: "An experiment can be repeated by a different experimenter using a different method and different apparatus, and still obtain the same results." },
      { id: "1-7", keyword: "Resolution", definition: "The smallest change in a quantity that causes a visible change in the reading that a measuring instrument records." },
      { id: "1-8", keyword: "Uncertainty", definition: "The interval that a value is said to lie within, with a given level of confidence." }
    ]
  },
  2: {
    name: "Particles and Radiation",
    cards: [
      { id: "2-1", keyword: "Alpha Decay", definition: "The process of an unstable nucleus emitting an alpha particle (two protons and two neutrons) to become more stable." },
      { id: "2-2", keyword: "Annihilation", definition: "The process of a particle and its antiparticle colliding and being converted into energy. The energy is released in two photons to conserve momentum." },
      { id: "2-3", keyword: "Antiparticle", definition: "All particles have a corresponding antiparticle with the same mass but opposite charge and conservation numbers." },
      { id: "2-4", keyword: "Baryon Number", definition: "A quantum number that is conserved in all particle interactions. Baryons have a baryon number of +1 and non-baryons have a baryon number of 0." },
      { id: "2-5", keyword: "Baryon", definition: "A class of hadron, that is made up of three quarks. The proton is the only stable baryon." },
      { id: "2-6", keyword: "Beta-Minus Decay", definition: "The process of a neutron inside a nucleus turning into a proton, and emitting a beta-minus particle (an electron) and an antineutrino." },
      { id: "2-7", keyword: "Beta-Plus Decay", definition: "The process of a proton inside a nucleus turning into a neutron, and emitting a beta-plus particle (a positron) and a neutrino." },
      { id: "2-8", keyword: "Electron Diffraction", definition: "The spreading of electrons as they pass through a gap similar to the magnitude of their de Broglie wavelength. It is evidence of the wave-like properties of particles." },
      { id: "2-9", keyword: "Electron-volt (eV)", definition: "The work done to accelerate an electron through a potential difference of 1V. 1eV is equal to the charge of an electron (E=qv)." },
      { id: "2-10", keyword: "Energy Levels", definition: "Defined and distinct energies at which electrons can exist in an atom. An electron cannot exist between energy levels." },
      { id: "2-11", keyword: "Excitation", definition: "The process of an electron taking in exactly the right quantity of energy to move to a higher energy level." },
      { id: "2-12", keyword: "Ground State", definition: "The most stable energy level that an electron can exist in." },
      { id: "2-13", keyword: "Hadrons", definition: "A class of subatomic particle that experiences the strong nuclear interaction." },
      { id: "2-14", keyword: "Ionisation", definition: "The process of an atom losing an orbital electron and becoming charged." },
      { id: "2-15", keyword: "Isotope", definition: "Same number of protons but different numbers of neutrons." },
      { id: "2-16", keyword: "Lepton", definition: "A group of elementary subatomic particles, consisting of electrons, muons and neutrinos." },
      { id: "2-17", keyword: "Meson", definition: "A class of hadron that is made up of a quark and antiquark pair." },
      { id: "2-18", keyword: "Neutrino", definition: "A subatomic particle whose existence was hypothesised to maintain the conservation of energy in beta decay." },
      { id: "2-19", keyword: "Photon", definition: "A packet of energy." },
      { id: "2-20", keyword: "Positron", definition: "A positively charged particle that is the antiparticle of an electron." },
      { id: "2-21", keyword: "Proton Number (Z)", definition: "The number of protons present in the nucleus of a given element." },
      { id: "2-22", keyword: "Work Function", definition: "The minimum energy required to remove an electron from a metal's surface." }
    ]
  },
  3: {
    name: "Waves",
    cards: [
      { id: "3-1", keyword: "Amplitude", definition: "A wave's maximum displacement from its equilibrium position." },
      { id: "3-2", keyword: "Antinode", definition: "A position of maximum displacement in a stationary wave." },
      { id: "3-3", keyword: "Cladding", definition: "A protective layer on an optical fibre to improve the tensile strength of the fibre, prevent scratching and to prevent signal transfer between adjacent fibres." },
      { id: "3-4", keyword: "Coherence", definition: "Waves are coherent if they have the same wavelength and frequency, as well as there being a fixed phase difference between them." },
      { id: "3-5", keyword: "Diffraction Grating", definition: "A grating with hundreds of slits per millimetre, that results in sharper interference patterns. They are used to calculate atomic spacing and to analyse elements." },
      { id: "3-6", keyword: "Diffraction", definition: "The spreading of waves as they pass through a gap of a similar magnitude to their wavelength." },
      { id: "3-7", keyword: "Electromagnetic Waves", definition: "Waves that consist of perpendicular electric and magnetic oscillations." },
      { id: "3-8", keyword: "Frequency", definition: "The number of waves that pass a point in a unit time period. It is the inverse of the time period." },
      { id: "3-9", keyword: "Fringe Spacing", definition: "The distance between two adjacent bright fringes or two adjacent dark fringes." },
      { id: "3-10", keyword: "Interference", definition: "The name given to the superposition of waves that occurs when two waves meet. If the waves are in phase they will constructively interfere, but if they are out of phase, they will destructively interfere." },
      { id: "3-11", keyword: "Laser", definition: "A light source that produces a collimated and coherent beam." },
      { id: "3-12", keyword: "Longitudinal Wave", definition: "A wave with oscillations that are parallel to the direction of energy propagation. Sound waves are an example of a longitudinal wave." },
      { id: "3-13", keyword: "Node", definition: "A position of minimum displacement in a stationary wave." },
      { id: "3-14", keyword: "Optical Fibre", definition: "A thin glass fibre through which signals are passed through. Optical fibres usually have cladding surrounding them." },
      { id: "3-15", keyword: "Path Difference", definition: "A measure of how far ahead a wave is compared to another wave, usually expressed in terms of the wavelength." },
      { id: "3-16", keyword: "Phase Difference", definition: "The difference in phase between two points on a wave. It is usually expressed in radians." },
      { id: "3-17", keyword: "Polarisation", definition: "The restriction of a wave so that it can only oscillate in a single plane. This can only occur for transverse waves." },
      { id: "3-18", keyword: "Refractive Index", definition: "A material property that is equal to the ratio between the speed of light in a vacuum, and the speed of light in a given material." },
      { id: "3-19", keyword: "Stationary Wave", definition: "A wave that stores, but does not transfer, energy." },
      { id: "3-20", keyword: "Total Internal Reflection", definition: "An effect that occurs in optical fibres, where full reflection occurs at the inside boundary of the fibre, meaning no radiation passes out." },
      { id: "3-21", keyword: "Transverse Wave", definition: "A wave with oscillations that are perpendicular to the direction of energy propagation. Electromagnetic waves are examples of transverse waves." },
      { id: "3-22", keyword: "Wavelength", definition: "The distance between two identical positions on two adjacent waves. It is commonly measured from peak to peak or trough to trough." }
    ]
  },
  4: {
    name: "Mechanics and Materials",
    cards: [
      { id: "4-1", keyword: "Breaking Stress", definition: "The maximum stress that an object can withstand before failure occurs." },
      { id: "4-2", keyword: "Brittle", definition: "A brittle object will show very little strain before reaching its breaking stress." },
      { id: "4-3", keyword: "Centre of Mass", definition: "The single point through which all the mass of an object can be said to act." },
      { id: "4-4", keyword: "Conservation of Energy", definition: "Energy cannot be created or destroyed - it can only be transferred into different forms." },
      { id: "4-5", keyword: "Conservation of Momentum", definition: "The total momentum of a system before an event, must be equal to the total momentum of the system after the event, assuming no external forces act." },
      { id: "4-6", keyword: "Couple", definition: "Two equal and opposite parallel forces that act on an object through different lines of action. It has the effect of causing a rotation without translation." },
      { id: "4-7", keyword: "Density", definition: "The mass per unit volume of a material." },
      { id: "4-8", keyword: "Efficiency", definition: "The ratio of useful output to total input for a given system." },
      { id: "4-9", keyword: "Elastic Behaviour", definition: "If a material deforms with elastic behaviour, it will return to its original shape when the deforming forces are removed. The object will not be permanently deformed." },
      { id: "4-10", keyword: "Elastic Limit", definition: "The force beyond which an object will no longer deform elastically, and instead deform plastically. Beyond the elastic limit, when the deforming forces are removed, the object will not return to its original shape." },
      { id: "4-11", keyword: "Equilibrium", definition: "For an object to be equilibrium, both the resultant force and resultant moment acting on the object must be equal to zero." },
      { id: "4-12", keyword: "Hooke's Law", definition: "The extension of an elastic object will be directly proportional to the force applied to it up to the object's limit of proportionality." },
      { id: "4-13", keyword: "Impulse", definition: "The change of momentum of an object when a force acts on it. It is equal to the product of the force acting on the object and the length of time over which it acts." },
      { id: "4-14", keyword: "Moment", definition: "The product of a force and the perpendicular distance from the line of action of the force to the pivot." },
      { id: "4-15", keyword: "Momentum", definition: "The product of an object's mass and velocity." },
      { id: "4-16", keyword: "Newton's First Law", definition: "An object will remain in its current state of motion, unless acted on by a resultant force. An object requires a resultant force to be able to accelerate." },
      { id: "4-17", keyword: "Newton's Second Law", definition: "The sum of the forces acting on an object is equal to the rate of change of momentum of the object." },
      { id: "4-18", keyword: "Newton's Third Law", definition: "Every action has an equal and opposite reaction. If an object exerts a force on another object, then the other object must exert a force back, that is opposite in direction and equal in magnitude." },
      { id: "4-19", keyword: "Plastic Behaviour", definition: "If a material deforms with plastic behaviour, it will not return to its original shape when the deforming forces are removed. The object will be permanently deformed." },
      { id: "4-20", keyword: "Spring Constant", definition: "The constant of proportionality for the extension of a spring under a force. The higher the spring constant, the greater the force needed to achieve a given extension." },
      { id: "4-21", keyword: "Tensile Strain", definition: "The ratio of an object's extension to its original length. It is a ratio of two lengths and so has no unit." },
      { id: "4-22", keyword: "Tensile Stress", definition: "The amount of force acting per unit area. Its unit is the Pascal (Pa)." },
      { id: "4-23", keyword: "Terminal Speed", definition: "The maximum speed of an object that occurs when the resistive and driving forces acting on the object are equal to each other." },
      { id: "4-24", keyword: "Young Modulus", definition: "The ratio of stress to strain for a given material. Its unit is the Pascal (Pa)." }
    ]
  },
  5: {
    name: "Electricity",
    cards: [
      { id: "5-1", keyword: "Ammeter", definition: "A device that measures the current in the loop of the circuit that it is connected in series with. An ideal ammeter is modelled to have zero resistance." },
      { id: "5-2", keyword: "Current", definition: "The rate of flow of charge in a circuit." },
      { id: "5-3", keyword: "Electromotive Force", definition: "The amount of energy transferred by a source, to each unit of charge that passes through it." },
      { id: "5-4", keyword: "Internal Resistance", definition: "The resistance to the flow of charge within a source. Internal resistance results in energy being dissipated within the source." },
      { id: "5-5", keyword: "Light Dependent Resistor", definition: "A light sensitive semiconductor whose resistance increases when light intensity decreases." },
      { id: "5-6", keyword: "Ohmic Conductor", definition: "A conductor for which the current flow is directly proportional to the potential difference across it, when under constant physical conditions." },
      { id: "5-7", keyword: "Ohm's Law", definition: "The current and potential difference through an ohmic conductor held under constant physical conditions are directly proportional, with the constant of proportionality being resistance." },
      { id: "5-8", keyword: "Parallel Circuits", definition: "Components are said to be connected in parallel when they are connected across each other (separate loops)." },
      { id: "5-9", keyword: "Potential Divider", definition: "A method of splitting a potential difference, by connecting two resistors in series. The total potential difference is split in the ratio of their resistances." },
      { id: "5-10", keyword: "Resistance", definition: "A measure of how difficult it is for current to flow through a material." },
      { id: "5-11", keyword: "Resistivity", definition: "A quantity that is proportional to an object's resistance and cross-sectional area, and inversely proportional to the object's length." },
      { id: "5-12", keyword: "Series Circuits", definition: "Components are said to be connected in series when they are connected end to end (in one loop)." },
      { id: "5-13", keyword: "Superconductor", definition: "A material which has zero resistivity when the temperature is decreased to, or below, the material's critical temperature." },
      { id: "5-14", keyword: "Thermistor", definition: "A temperature sensitive semiconductor whose resistance increases when temperature decreases." },
      { id: "5-15", keyword: "Voltmeter", definition: "A device used to measure the potential difference across components. An ideal voltmeter is modelled to have infinite resistance." }
    ]
  },
  6: {
    name: "Further Mechanics",
    cards: [
      { id: "6-1", keyword: "Angular Speed", definition: "A measure of the speed of an object's angular rotation. It is equal to the frequency of rotation multiplied by 2π." },
      { id: "6-2", keyword: "Centripetal Acceleration", definition: "The acceleration of an object moving in circular motion. Any object in circular motion must have an acceleration since the direction of the object, and therefore the velocity of the object, is constantly changing." },
      { id: "6-3", keyword: "Centripetal Force", definition: "The resultant force responsible for an object moving in circular motion. Centripetal forces always act towards the centre of the object's rotation." },
      { id: "6-4", keyword: "Critical Damping", definition: "The form of damping that reduces the displacement of an oscillating object to its equilibrium position in the quickest time possible and without further oscillation." },
      { id: "6-5", keyword: "Damping", definition: "The dissipation of energy from an oscillating system. The consequence is that the amplitude of oscillation will decrease. Damping occurs when a force opposes the system's motion." },
      { id: "6-6", keyword: "Forced Vibrations", definition: "Repeated up and down oscillations, at the frequency of a driver. The amplitude of oscillation is small at high frequencies and large at low frequencies." },
      { id: "6-7", keyword: "Free Vibrations", definition: "Oscillations that are not caused by a driver. An object will naturally oscillate at its natural frequency." },
      { id: "6-8", keyword: "Radian", definition: "A unit of angle." },
      { id: "6-9", keyword: "Resonance", definition: "Resonance occurs when the frequency of oscillations is equal to the natural frequency of the oscillating system. The rate of energy transfer is at a maximum during resonance." },
      { id: "6-10", keyword: "Simple Harmonic Motion", definition: "Motion where the acceleration of an object is directly proportional, and in the opposite direction, to its displacement." }
    ]
  },
  7: {
    name: "Thermal Physics",
    cards: [
      { id: "7-1", keyword: "Absolute Zero", definition: "The lowest possible temperature of a system, where no heat remains and the particles in the system have no kinetic energy." },
      { id: "7-2", keyword: "Avogadro Constant", definition: "The number of particles that make up one mole of any gas." },
      { id: "7-3", keyword: "Boltzmann Constant", definition: "A constant relating the average kinetic energy of the particles in a gas, to the gas' temperature." },
      { id: "7-4", keyword: "Boyle's Law", definition: "The pressure of an ideal gas is inversely proportional to its volume when held at constant temperature." },
      { id: "7-5", keyword: "Brownian Motion", definition: "The random motion of particles." },
      { id: "7-6", keyword: "Charles' Law", definition: "The volume of an ideal gas is directly proportional to its absolute temperature when held at constant pressure." },
      { id: "7-7", keyword: "Ideal Gas", definition: "A gas that meets the ideal gas assumptions. All the gas laws are based on ideal gases." },
      { id: "7-8", keyword: "Internal Energy", definition: "The sum of the randomly distributed kinetic and potential energies of the particles in a given system." },
      { id: "7-9", keyword: "Kelvin Scale", definition: "An absolute temperature scale that starts at absolute zero (0K = -273°C)." },
      { id: "7-10", keyword: "Pressure Law", definition: "The pressure of an ideal gas is directly proportional to its absolute temperature, when the volume is fixed." },
      { id: "7-11", keyword: "Specific Heat Capacity", definition: "The amount of energy required to increase the temperature of 1kg of a substance by 1 Kelvin." },
      { id: "7-12", keyword: "Specific Latent Heat", definition: "The amount of energy required to change the state of 1kg of a substance without a change of temperature." }
    ]
  },
  8: {
    name: "Fields and their Consequences",
    cards: [
      { id: "8-1", keyword: "Capacitance", definition: "The charge stored per unit pd in a capacitor." },
      { id: "8-2", keyword: "Capacitor", definition: "An electrical component that stores charge. A parallel-plate capacitor is made of two parallel conducting plates with an insulator between them (dielectric)." },
      { id: "8-3", keyword: "Coulomb's Law", definition: "The size of the force that acts between two point charges is proportional to the product of their charges and inversely proportional to the square of their separation." },
      { id: "8-4", keyword: "Electric Field", definition: "A region surrounding a charged object which causes a force to be exerted on any charged object placed within the field." },
      { id: "8-5", keyword: "Electric Field Strength", definition: "The force per unit positive charge exerted on a charged object placed at that point in the field. This is a vector acting in the same direction as the force on a positive charge." },
      { id: "8-6", keyword: "Electric Potential", definition: "The work done per unit charge on a positive test charge in bringing it from infinity to that point in the field." },
      { id: "8-7", keyword: "Escape Velocity", definition: "The minimum velocity required by an object to be able to escape a gravitational field of a mass when projected vertically from its surface." },
      { id: "8-8", keyword: "Field Line", definition: "A line representing the path that a north pole (magnetic field), positive charge (electric field) or mass (gravitational field) would take when placed within the field." },
      { id: "8-9", keyword: "Geostationary Satellite", definition: "A satellite that orbits above the equator with a 24 hour period, so it will always remain above the same position on the Earth. They orbit approximately 36,000km above the surface of the Earth." },
      { id: "8-10", keyword: "Gravitational Field", definition: "A region surrounding a mass in which any other object with mass will experience an attractive force." },
      { id: "8-11", keyword: "Gravitational Field Strength", definition: "The force per unit mass exerted on a small test mass placed within the field." },
      { id: "8-12", keyword: "Kepler's Third Law", definition: "The square of an object's orbital period (T) is directly proportional to the cube of its orbital radius (r) – T² ∝ r³." },
      { id: "8-13", keyword: "Lenz's Law", definition: "The induced EMF opposes the change in magnetic flux that produces it." },
      { id: "8-14", keyword: "Magnetic Flux", definition: "A value which describes the magnetic field or field lines passing through an area. It is the product of magnetic flux density and the perpendicular area it passes through." },
      { id: "8-15", keyword: "Magnetic Flux Density", definition: "The force per unit current per unit length on a current-carrying wire placed at 90º to the field lines." },
      { id: "8-16", keyword: "Permittivity of free space", definition: "A measure of the ability of a vacuum to allow an electric field to pass through it." }
    ]
  },
  9: {
    name: "Nuclear Physics",
    cards: [
      { id: "9-1", keyword: "Activity", definition: "The rate of decay of the radioactive nuclei in a given isotope. It is proportional to the total number of nuclei in the sample and is measured in Becquerels." },
      { id: "9-2", keyword: "Alpha Decay", definition: "The emission of an alpha particle (2 protons and 2 neutrons) from an unstable nucleus (usually one with too much mass) to make it more stable." },
      { id: "9-3", keyword: "Background Radiation", definition: "Radiation that is found in small quantities all around us. It originates from natural sources such as rocks and cosmic rays as well as man-made sources." },
      { id: "9-4", keyword: "Beta Decay", definition: "The emission of a beta particle when a proton turns into a neutron (or vice versa) in an unstable nucleus." },
      { id: "9-5", keyword: "Binding Energy", definition: "The amount of energy required to split a nucleus into all its separate constituent nucleons. It is equivalent to the mass defect." },
      { id: "9-6", keyword: "Chain Reaction", definition: "The process of the neutrons released by a fission reaction inducing further fissile nuclei to undergo fission." },
      { id: "9-7", keyword: "Critical Mass", definition: "The smallest mass of fissile material required in a fission reactor for a chain reaction to be sustained." },
      { id: "9-8", keyword: "Fission", definition: "The splitting a nucleus, to form two smaller daughter nuclei, neutrons and energy." },
      { id: "9-9", keyword: "Fusion", definition: "The joining of two smaller nuclei to form a larger nucleus and to release energy." },
      { id: "9-10", keyword: "Gamma Decay", definition: "The emission of gamma rays from an unstable nucleus that has too much energy." },
      { id: "9-11", keyword: "Half-Life", definition: "The average time it takes for the number of radioactive nuclei in a sample to halve." },
      { id: "9-12", keyword: "Inverse Square-Law", definition: "A law that governs the intensity of gamma radiation. It means that the intensity of radiation at any point is inversely proportional to the square of the distance from its source." },
      { id: "9-13", keyword: "Irradiation", definition: "The exposure of an object to radiation. The exposed object does not become radioactive." },
      { id: "9-14", keyword: "Mass Defect", definition: "The difference in mass between a nucleus and the sum of the masses of its constituent nucleons." },
      { id: "9-15", keyword: "Radioactive Dating", definition: "The use of radioactive isotopes with known half-lives to date objects. The isotope that is usually used is Carbon-14." }
    ]
  }
};

const PHYSICISTS = [
  "Isaac Newton", "Albert Einstein", "Marie Curie", "Niels Bohr",
  "Richard Feynman", "Stephen Hawking", "Erwin Schrödinger", "Max Planck",
  "Wolfgang Pauli", "Paul Dirac", "Ernest Rutherford", "Michael Faraday"
];

// Main App Component
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'student' or 'teacher'
  const [showLoginScreen, setShowLoginScreen] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('physicistName');
    const savedRole = localStorage.getItem('userRole');
    if (savedUser) {
      setCurrentUser(savedUser);
      setUserRole(savedRole || 'student');
      setShowLoginScreen(false);
    }
  }, []);

  const handleLogin = (physicist, role) => {
    setCurrentUser(physicist);
    setUserRole(role);
    localStorage.setItem('physicistName', physicist);
    localStorage.setItem('userRole', role);
    setShowLoginScreen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem('physicistName');
    localStorage.removeItem('userRole');
    setShowLoginScreen(true);
  };

  if (showLoginScreen) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (userRole === 'student') {
    return <StudentInterface studentName={currentUser} onLogout={handleLogout} />;
  } else {
    return <TeacherInterface onLogout={handleLogout} />;
  }
}

// Login Screen Component
function LoginScreen({ onLogin }) {
  const [showRole, setShowRole] = useState(false);
  const [selectedPhysicist, setSelectedPhysicist] = useState(null);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>⚛️ AQA Physics Flashcard System</h1>
        <p className="subtitle">KS5 Physics - Leitner Flashcards</p>

        {!showRole ? (
          <>
            <p className="instruction">Select your name or role to continue:</p>
            <button className="role-button primary" onClick={() => setShowRole('student')}>
              👨‍🎓 I'm a Student
            </button>
            <button className="role-button secondary" onClick={() => setShowRole('teacher')}>
              👨‍🏫 I'm a Teacher
            </button>
          </>
        ) : showRole === 'student' ? (
          <>
            <p className="instruction">Choose your physicist name:</p>
            <div className="physicist-grid">
              {PHYSICISTS.map(physicist => (
                <button
                  key={physicist}
                  className={`physicist-button ${selectedPhysicist === physicist ? 'selected' : ''}`}
                  onClick={() => onLogin(physicist, 'student')}
                >
                  {physicist}
                </button>
              ))}
            </div>
            <button className="back-button" onClick={() => { setShowRole(false); setSelectedPhysicist(null); }}>
              ← Back
            </button>
          </>
        ) : (
          <>
            <button className="role-button primary" onClick={() => onLogin('Teacher', 'teacher')}>
              Access Teacher Dashboard
            </button>
            <button className="back-button" onClick={() => setShowRole(false)}>
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Student Interface Component
function StudentInterface({ studentName, onLogout }) {
  const [availableTopics, setAvailableTopics] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [sessionActive, setSessionActive] = useState(false);
  const [cardProgress, setCardProgress] = useState({});
  const [sessionDate, setSessionDate] = useState(new Date().toDateString());

  useEffect(() => {
    fetchAvailableTopics();
    checkSessionDate();
  }, []);

  useEffect(() => {
    let timer;
    if (sessionActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && sessionActive) {
      setSessionActive(false);
      saveSessionData();
    }
    return () => clearInterval(timer);
  }, [sessionActive, timeRemaining]);

  const checkSessionDate = async () => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('lastSessionDate');
    if (savedDate !== today) {
      localStorage.setItem('lastSessionDate', today);
      setTimeRemaining(600);
    } else {
      const savedTime = localStorage.getItem('timeRemaining');
      if (savedTime) setTimeRemaining(parseInt(savedTime));
    }
  };

  const fetchAvailableTopics = async () => {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `studentSettings/${studentName}`));
      if (snapshot.exists()) {
        setAvailableTopics(snapshot.val());
      } else {
        // Initialize all topics as disabled for new student
        const topics = {};
        Object.keys(FLASHCARD_DATA).forEach(topicId => {
          topics[topicId] = false;
        });
        setAvailableTopics(topics);
      }
    } catch (error) {
      console.log("Initial load - using demo mode");
      // Demo mode - enable all topics
      const topics = {};
      Object.keys(FLASHCARD_DATA).forEach(topicId => {
        topics[topicId] = true;
      });
      setAvailableTopics(topics);
    }
  };

  const startSession = (topicId) => {
    if (FLASHCARD_DATA[topicId]) {
      setSelectedTopic(topicId);
      setCardIndex(0);
      setIsFlipped(false);
      setSessionActive(true);
      setCardProgress({});
      localStorage.setItem('timeRemaining', timeRemaining);
    }
  };

  const handleCardResponse = (isCorrect) => {
    if (selectedTopic) {
      const topicCards = FLASHCARD_DATA[selectedTopic].cards;
      const currentCard = topicCards[cardIndex];
      
      setCardProgress(prev => ({
        ...prev,
        [currentCard.id]: isCorrect
      }));

      if (cardIndex < topicCards.length - 1) {
        setCardIndex(cardIndex + 1);
        setIsFlipped(false);
      } else {
        // Topic complete for today
        completeSession();
      }
    }
  };

  const completeSession = async () => {
    setSessionActive(false);
    await saveSessionData();
  };

  const saveSessionData = async () => {
    try {
      const today = new Date().toDateString();
      const sessionData = {
        date: today,
        topicId: selectedTopic,
        timeSpent: 600 - timeRemaining,
        cardsReviewed: Object.keys(cardProgress).length,
        cardsCorrect: Object.values(cardProgress).filter(v => v).length
      };
      
      await update(ref(database, `studentProgress/${studentName}/sessions`), {
        [today]: sessionData
      });

      localStorage.setItem('timeRemaining', timeRemaining);
    } catch (error) {
      console.log("Session data saved locally");
    }
  };

  if (selectedTopic && sessionActive && FLASHCARD_DATA[selectedTopic]) {
    return <FlashcardView
      topic={FLASHCARD_DATA[selectedTopic]}
      cardIndex={cardIndex}
      isFlipped={isFlipped}
      onFlip={() => setIsFlipped(!isFlipped)}
      onCorrect={() => handleCardResponse(true)}
      onIncorrect={() => handleCardResponse(false)}
      timeRemaining={timeRemaining}
      studentName={studentName}
      onExit={() => {
        setSessionActive(false);
        setSelectedTopic(null);
      }}
    />;
  }

  return (
    <div className="student-container">
      <div className="header">
        <h1>Welcome, {studentName}! ⚛️</h1>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>

      <div className="topics-grid">
        {Object.entries(FLASHCARD_DATA).map(([topicId, topic]) => (
          <div key={topicId} className="topic-card">
            <h3>{topic.name}</h3>
            <p className="card-count">{topic.cards.length} keywords</p>
            {availableTopics[topicId] ? (
              <button className="start-button" onClick={() => startSession(topicId)}>
                Start Session
              </button>
            ) : (
              <button className="disabled-button" disabled>Not Assigned</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Flashcard View Component
function FlashcardView({ topic, cardIndex, isFlipped, onFlip, onCorrect, onIncorrect, timeRemaining, studentName, onExit }) {
  const card = topic.cards[cardIndex];
  const progress = ((cardIndex + 1) / topic.cards.length) * 100;
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flashcard-container">
      <div className="session-header">
        <div className="timer">{formatTime(timeRemaining)}</div>
        <button className="exit-button" onClick={onExit}>Exit</button>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="progress-text">{cardIndex + 1} of {topic.cards.length}</p>

      <h2>{topic.name}</h2>

      <div className="flashcard" onClick={onFlip}>
        <div className={`card-content ${isFlipped ? 'flipped' : ''}`}>
          <div className="card-side front">
            <p className="card-label">Keyword</p>
            <p className="card-text">{card.keyword}</p>
            <p className="tap-hint">Tap to reveal definition</p>
          </div>
          <div className="card-side back">
            <p className="card-label">Definition</p>
            <p className="card-text">{card.definition}</p>
            <p className="tap-hint">Tap to flip back</p>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="response-buttons">
          <button className="btn-correct" onClick={onCorrect}>✓ Got it</button>
          <button className="btn-incorrect" onClick={onIncorrect}>✗ Need review</button>
        </div>
      )}
    </div>
  );
}

// Teacher Interface Component
function TeacherInterface({ onLogout }) {
  const [students] = useState(['Student 1', 'Student 2']); // Replace with actual student list
  const [studentSettings, setStudentSettings] = useState({});

  useEffect(() => {
    initializeStudentSettings();
  }, []);

  const initializeStudentSettings = async () => {
    const settings = {};
    students.forEach(student => {
      settings[student] = {};
      Object.keys(FLASHCARD_DATA).forEach(topicId => {
        settings[student][topicId] = false;
      });
    });
    setStudentSettings(settings);
  };

  const toggleTopic = async (student, topicId) => {
    const newSettings = { ...studentSettings };
    newSettings[student][topicId] = !newSettings[student][topicId];
    setStudentSettings(newSettings);

    try {
      await update(ref(database, `studentSettings/${student}`), {
        [topicId]: newSettings[student][topicId]
      });
    } catch (error) {
      console.log("Settings updated locally");
    }
  };

  return (
    <div className="teacher-container">
      <div className="header">
        <h1>Teacher Dashboard 👨‍🏫</h1>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>

      <div className="teacher-grid">
        {students.map(student => (
          <div key={student} className="student-assignment-card">
            <h3>{student}</h3>
            <div className="topics-list">
              {Object.entries(FLASHCARD_DATA).map(([topicId, topic]) => (
                <label key={topicId} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={studentSettings[student]?.[topicId] || false}
                    onChange={() => toggleTopic(student, topicId)}
                  />
                  <span>{topic.name}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
