import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ImpactStories = ({ data = {} }) => {
  const categories = data?.categories ?? [];
  const stories = data?.stories ?? [];
  const defaultCategory = categories?.[0]?.id ?? 'all';
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

  useEffect(() => {
    setSelectedCategory(categories?.[0]?.id ?? 'all');
  }, [categories]);

  const filteredStories = useMemo(() => {
    if (selectedCategory === 'all') {
      return stories;
    }
    return stories?.filter((story) => story?.category === selectedCategory);
  }, [stories, selectedCategory]);

  return (
    <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h3 className="font-headline text-xl font-bold text-text-primary">
            {data?.header?.title}
          </h3>
          <p className="font-body text-text-secondary mt-1">{data?.header?.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
          {categories?.map((category) => (
            <Button
              key={category?.id}
              variant={selectedCategory === category?.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category?.id)}
              iconName={category?.icon}
              iconPosition="left"
              iconSize={16}
              className="text-xs"
            >
              {category?.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {filteredStories?.map((story, index) => (
          <div
            key={story?.id}
            className="bg-muted rounded-lg overflow-hidden interactive-lift animate-depth-reveal"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={story?.image}
                alt={story?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-cta-medium">
                {story?.impact}
              </div>

              <div className="absolute bottom-3 left-3 text-white">
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="MapPin" size={14} />
                  <span className="font-cta-medium">{story?.location}</span>
                </div>
                <div className="text-xs opacity-80 mt-1">{story?.region}</div>
              </div>

              <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {story?.date}
              </div>
            </div>

            <div className="p-5">
              <h4 className="font-headline text-lg font-bold text-text-primary mb-3">{story?.title}</h4>

              <p className="font-body text-sm text-text-secondary mb-4 leading-relaxed">
                {story?.description}
              </p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {story?.metrics?.map((metric, idx) => (
                  <div key={idx} className="text-center p-2 bg-background rounded-lg">
                    <Icon name={metric?.icon} size={16} className="text-primary mx-auto mb-1" />
                    <div className="font-headline text-sm font-bold text-text-primary">{metric?.value}</div>
                    <div className="font-body text-xs text-text-secondary">{metric?.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Quote" size={16} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-body text-sm text-text-primary italic mb-2">
                      "{story?.testimonial?.quote}"
                    </p>
                    <div className="text-xs">
                      <div className="font-cta-medium text-text-primary">{story?.testimonial?.author}</div>
                      <div className="text-text-secondary">{story?.testimonial?.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-ocean-deep/10 to-ocean-medium/10 rounded-lg p-6">
          <h4 className="font-headline text-lg font-bold text-text-primary mb-2">{data?.cta?.title}</h4>
          <p className="font-body text-text-secondary mb-4">{data?.cta?.description}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="default" iconName={data?.cta?.primary?.icon} iconPosition="left">
              {data?.cta?.primary?.label}
            </Button>
            <Button variant="outline" iconName={data?.cta?.secondary?.icon} iconPosition="left">
              {data?.cta?.secondary?.label}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactStories;
