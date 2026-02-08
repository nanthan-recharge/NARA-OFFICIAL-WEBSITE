import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const SecurityBadges = ({ className }) => {
  const { t } = useTranslation('paymentGateway');
  const securityFeatures = [
    {
      icon: 'Shield',
      title: t('security.features.ssl.title'),
      description: t('security.features.ssl.description'),
      color: 'text-green-600'
    },
    {
      icon: 'Lock',
      title: t('security.features.pci.title'),
      description: t('security.features.pci.description'),
      color: 'text-blue-600'
    },
    {
      icon: 'CheckCircle',
      title: t('security.features.cbsl.title'),
      description: t('security.features.cbsl.description'),
      color: 'text-purple-600'
    },
    {
      icon: 'Zap',
      title: t('security.features.twoFactor.title'),
      description: t('security.features.twoFactor.description'),
      color: 'text-orange-600'
    }
  ];

  const certifications = [
    {
      name: t('security.certifications.cbsl'),
      logo: null,
      certified: true
    },
    {
      name: t('security.certifications.pci'),
      logo: null,
      certified: true
    },
    {
      name: t('security.certifications.iso'),
      logo: null,
      certified: true
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Security Features */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Shield" size={16} className="text-blue-600" />
          {t('security.sectionTitle')}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Icon name={feature?.icon} size={16} className={feature?.color} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {feature?.title}
                </div>
                <div className="text-xs text-gray-600">
                  {feature?.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Certifications */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="Award" size={16} className="text-blue-600" />
          {t('security.certificationsTitle')}
        </h3>
        
        <div className="space-y-2">
          {certifications?.map((cert, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  {cert?.logo ? (
                    <img src={cert?.logo} alt={cert?.name} className="w-6 h-6" />
                  ) : (
                    <Icon name="Award" size={16} className="text-gray-600" />
                  )}
                </div>
                <span className="text-sm text-gray-900">{cert?.name}</span>
              </div>
              
              {cert?.certified && (
                <Icon name="CheckCircle" size={16} className="text-green-600" />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Payment Protection Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="ShieldCheck" size={20} className="text-blue-600 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-semibold text-gray-900 mb-2">
              {t('security.guarantee.title')}
            </div>
            <ul className="space-y-1 text-gray-700">
              <li className="flex items-center gap-2">
                <Icon name="Check" size={12} className="text-green-600" />
                {t('security.guarantee.items.bankGrade')}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Check" size={12} className="text-green-600" />
                {t('security.guarantee.items.fraud')}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Check" size={12} className="text-green-600" />
                {t('security.guarantee.items.monitoring')}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Check" size={12} className="text-green-600" />
                {t('security.guarantee.items.refund')}
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Support Information */}
      <div className="text-center space-y-2">
        <div className="text-xs text-gray-500">
          {t('security.supportHelp')}
        </div>
        
        <div className="flex items-center justify-center gap-4 text-xs">
          <a 
            href="tel:+94112694444" 
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <Icon name="Phone" size={12} />
            +94 11 269 4444
          </a>
          
          <a 
            href="mailto:payments@nara.ac.lk" 
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <Icon name="Mail" size={12} />
            payments@nara.ac.lk
          </a>
        </div>
      </div>
      {/* Compliance Footer */}
      <div className="text-center pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {t('security.compliance.licensed')}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {t('security.compliance.regulated')}
        </div>
      </div>
    </div>
  );
};

export default SecurityBadges;
