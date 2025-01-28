import { NavLink } from 'react-router-dom';

interface SocialLoginItemProps {
  icon: string;
  alt: string;
  to: string;
}

const SocialLoginItem = ({ icon, alt, to }: SocialLoginItemProps) => {
  return (
    <NavLink to={to}>
      {() => (
        <div>
          <img src={icon} alt={alt} />
        </div>
      )}
    </NavLink>
  );
};

export default SocialLoginItem;
