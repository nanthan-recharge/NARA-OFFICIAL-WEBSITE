
import React from 'react';
import ParticleSystem from './ParticleSystem';

const StitchWrapper = ({ children, className = "" }) => {
    return (
        <div className={`relative min-h-screen bg-[#0a192f] overflow-hidden ${className}`}>
            {/* Digital Ocean Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#112240] to-[#0a192f]" />

            {/* Particles */}
            <div className="absolute inset-0">
                <ParticleSystem count={30} className="opacity-30" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default StitchWrapper;
