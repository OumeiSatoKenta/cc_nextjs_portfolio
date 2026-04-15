import { render } from '@testing-library/react';
import { ProjectThumbnail } from '@/components/projects/ProjectThumbnail';

describe('ProjectThumbnail', () => {
  describe('icon fallback', () => {
    it('renders gradient background with ship-red color', () => {
      const { container } = render(<ProjectThumbnail accentColor="ship" icon="Cloud" />);
      const el = container.querySelector('[aria-hidden="true"]');
      expect(el).toBeInTheDocument();
      expect(el).toHaveClass('from-ship-red/20', 'to-ship-red/5');
    });

    it('renders gradient background with preview-pink color', () => {
      const { container } = render(<ProjectThumbnail accentColor="preview" icon="Users" />);
      const el = container.querySelector('[aria-hidden="true"]');
      expect(el).toHaveClass('from-preview-pink/20', 'to-preview-pink/5');
    });

    it('renders gradient background with develop-blue color', () => {
      const { container } = render(<ProjectThumbnail accentColor="develop" icon="Globe" />);
      const el = container.querySelector('[aria-hidden="true"]');
      expect(el).toHaveClass('from-develop-blue/20', 'to-develop-blue/5');
    });

    it('renders icon SVG with accent color class', () => {
      const { container } = render(<ProjectThumbnail accentColor="ship" icon="Globe" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('text-ship-red');
    });

    it('renders nothing for unknown icon', () => {
      const { container } = render(<ProjectThumbnail accentColor="ship" icon="UnknownIcon" />);
      expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
    });
  });

  describe('image mode', () => {
    it('renders img element when image is provided', () => {
      const { container } = render(
        <ProjectThumbnail accentColor="ship" icon="Globe" image="/images/test.png" />
      );
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    it('applies object-cover and object-top by default', () => {
      const { container } = render(
        <ProjectThumbnail accentColor="ship" icon="Globe" image="/images/test.png" />
      );
      const img = container.querySelector('img');
      expect(img).toHaveClass('object-cover', 'object-top');
    });

    it('applies object-contain when fit is contain', () => {
      const { container } = render(
        <ProjectThumbnail
          accentColor="preview"
          icon="Globe"
          image="/images/test.png"
          fit="contain"
        />
      );
      const img = container.querySelector('img');
      expect(img).toHaveClass('object-contain');
      expect(img).not.toHaveClass('object-cover');
    });

    it('applies gradient background behind image', () => {
      const { container } = render(
        <ProjectThumbnail accentColor="ship" icon="Globe" image="/images/test.png" />
      );
      const el = container.querySelector('[aria-hidden="true"]');
      expect(el).toHaveClass('from-ship-red/20');
    });
  });
});
