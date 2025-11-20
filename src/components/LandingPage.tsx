import React from 'react';
import Image from 'next/image';
import { Menu, X, ShoppingCart, Package, Clock, Shield, Phone, MapPin, Mail, Facebook, Twitter, Instagram, Linkedin, ArrowRight, User, Info, Download, MailOpen, Send, Apple, Play } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const colors = {
  primary: '#FF7F30',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#111111',
  lightGray: '#F5F5F5',
};

const sectionMaxWidth = 1200;

const formatPrice = (price: any, currency?: string) => {
  if (price == null) {
    return 'Sur demande';
  }

  const numericPrice = Number(price);
  const base =
    Number.isFinite(numericPrice)
      ? numericPrice.toLocaleString('fr-FR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : String(price);

  return `${base} ${currency || 'XOF'}`;
};

const renderFeatures = (features: any) => {
  if (!features) {
    return null;
  }

  if (Array.isArray(features) && features.length > 0) {
    return (
      <ul
        style={{
          marginTop: '0.75rem',
          paddingLeft: '1.2rem',
          color: colors.lightGray,
          fontSize: '0.9rem',
        }}
      >
        {features.map((item, index) => (
          <li key={index}>{String(item)}</li>
        ))}
      </ul>
    );
  }

  if (typeof features === 'object') {
    const entries = Object.entries(features).filter(([, value]) => Boolean(value));

    if (!entries.length) {
      return null;
    }

    return (
      <ul
        style={{
          marginTop: '0.75rem',
          paddingLeft: '1.2rem',
          color: colors.lightGray,
          fontSize: '0.9rem',
        }}
      >
        {entries.map(([key], index) => (
          <li key={index}>{key}</li>
        ))}
      </ul>
    );
  }

  return null;
};

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [pricing, setPricing] = React.useState<{ client: any[]; livreur: any[] }>({
    client: [],
    livreur: [],
  });
  const [pricingLoading, setPricingLoading] = React.useState<boolean>(true);
  const [pricingError, setPricingError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPlans = async () => {
      if (!supabase) {
        setPricingError(
          "Configuration Supabase manquante pour l'affichage des tarifs.",
        );
        setPricingLoading(false);
        return;
      }

      try {
        setPricingLoading(true);
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price', { ascending: true });

        if (error) {
          setPricingError(
            error.message ||
              'Impossible de charger les tarifs pour le moment.',
          );
          return;
        }

        const allPlans = data || [];
        const clientPlans = allPlans.filter(
          (plan: any) => plan.user_type === 'client',
        );
        const livreurPlans = allPlans.filter(
          (plan: any) => plan.user_type === 'livreur',
        );

        setPricing({
          client: clientPlans,
          livreur: livreurPlans,
        });
        setPricingError(null);
      } catch (err) {
        setPricingError('Erreur inattendue lors du chargement des tarifs.');
      } finally {
        setPricingLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div
      className="lp-page"
      style={{
        minHeight: '100vh',
        backgroundColor: colors.black,
        color: colors.white,
      }}
    >
      {/* Header */}
      <header
        className="lp-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Image
            src="/images/cliver-logo.png"
            alt="Cliver Logo"
            width={40}
            height={40}
            style={{ objectFit: 'contain' }}
          />
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Cliver
            <Package size={24} color={colors.primary} />
          </span>
        </div>

        <nav className="lp-header-nav-links">
          <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', flexWrap: 'wrap' }}>
            <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Accueil</a></li>
            <li><a href="#features" style={{ color: 'white', textDecoration: 'none' }}>Fonctionnalités</a></li>
            <li><a href="#how-it-works" style={{ color: 'white', textDecoration: 'none' }}>Comment ça marche</a></li>
            <li><a href="#pricing" style={{ color: 'white', textDecoration: 'none' }}>Tarifs</a></li>
            <li><a href="#contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</a></li>
          </ul>
        </nav>

        <button
          className="lp-header-menu-button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.25rem',
          }}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="lp-header-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: 'white',
              border: `1px solid ${colors.primary}`,
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 127, 48, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <User size={20} />
            Se connecter
          </button>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 127, 48, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ArrowRight size={20} />
            Commencer
          </button>
        </div>

        <div
          className={`lp-header-mobile-menu ${isMenuOpen ? 'open' : ''}`}
          style={{
            width: '100%',
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: `1px solid ${colors.gray}`,
          }}
        >
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <li>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Accueil</a>
            </li>
            <li>
              <a href="#features" style={{ color: 'white', textDecoration: 'none' }}>Fonctionnalités</a>
            </li>
            <li>
              <a href="#how-it-works" style={{ color: 'white', textDecoration: 'none' }}>Comment ça marche</a>
            </li>
            <li>
              <a href="#pricing" style={{ color: 'white', textDecoration: 'none' }}>Tarifs</a>
            </li>
            <li>
              <a href="#contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</a>
            </li>
          </ul>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="lp-hero"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 2rem 2rem',
          textAlign: 'center',
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/cliver-logo.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <h1
            className="lp-hero-title"
            style={{
              fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
              marginBottom: '1.5rem',
              lineHeight: '1.2',
            }}
          >
            Livraison rapide et fiable avec <span style={{ color: colors.primary }}>Cliver</span>
          </h1>
          <p
            className="lp-hero-subtitle"
            style={{
              fontSize: 'clamp(1rem, 4vw, 1.25rem)',
              marginBottom: '2rem',
              color: colors.lightGray,
            }}
          >
            Commandez en quelques clics et recevez vos colis en un temps record. 
            Des livreurs professionnels à votre service 24/7.
          </p>
          <div className="lp-hero-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
                backgroundColor: colors.primary,
                color: colors.black,
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 127, 48, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/client';
                }
              }}
            >
              <User size={20} />
              <span className="lp-hero-btn-label">Client</span>
            </button>
            <button
              style={{
                backgroundColor: 'transparent',
                color: colors.white,
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 127, 48, 0.1)';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 127, 48, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/livreur';
                }
              }}
            >
              <Package size={20} />
              <span className="lp-hero-btn-label">Livreur</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{
          padding: '4rem 1.5rem',
          backgroundColor: colors.gray,
        }}
      >
        <div style={{ maxWidth: sectionMaxWidth, margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: 'clamp(2rem, 4.5vw, 2.5rem)',
              marginBottom: '3rem',
            }}
          >
            Nos <span style={{ color: colors.primary }}>avantages</span>
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            {[
              {
                title: 'Livraison rapide',
                description: 'Recevez vos colis en moins de 30 minutes dans la plupart des zones urbaines.',
                icon: <Clock size={40} color={colors.primary} />,
              },
              {
                title: 'Suivi en temps réel',
                description: 'Suivez votre commande en direct sur la carte et soyez informé à chaque étape.',
                icon: <MapPin size={40} color={colors.primary} />,
              },
              {
                title: 'Service 24/7',
                description: 'Nous sommes disponibles jour et nuit, même les week-ends et jours fériés.',
                icon: <Shield size={40} color={colors.primary} />,
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: colors.black,
                  padding: '2rem',
                  borderRadius: '12px',
                  textAlign: 'center',
                  transition: 'transform 0.3s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: colors.primary }}>
                  {feature.title}
                </h3>
                <p style={{ color: colors.lightGray }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        style={{
          padding: '4rem 1.5rem',
          backgroundColor: colors.black,
        }}
      >
        <div style={{ maxWidth: sectionMaxWidth, margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: 'clamp(2rem, 4.5vw, 2.5rem)',
              marginBottom: '3rem',
            }}
          >
            Comment ça <span style={{ color: colors.primary }}>fonctionne</span> ?
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Parcours client */}
            <div
              style={{
                backgroundColor: colors.gray,
                padding: '2rem',
                borderRadius: '12px',
              }}
            >
              <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: colors.primary }}>
                Pour les clients
              </h3>
              <p style={{ color: colors.lightGray, marginBottom: '1.5rem' }}>
                De la création de votre mission jusqu'à la livraison, tout se fait en quelques étapes simples.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  {
                    step: '1',
                    title: "Téléchargez l'application",
                    description: 'Disponible sur iOS et Android. Créez votre compte en quelques secondes.',
                    icon: <Download size={30} color={colors.primary} />,
                  },
                  {
                    step: '2',
                    title: 'Crée votre mission',
                    description: "Sélectionnez ce dont vous avez besoin et précisez l'adresse de livraison.",
                    icon: <ShoppingCart size={30} color={colors.primary} />,
                  },
                  {
                    step: '3',
                    title: 'Suivez en direct',
                    description: 'Visualisez la position de votre livreur en temps réel sur la carte.',
                    icon: <MapPin size={30} color={colors.primary} />,
                  },
                  {
                    step: '4',
                    title: 'Recevez votre commande',
                    description: 'Votre colis vous est livré rapidement et en toute sécurité.',
                    icon: <Package size={30} color={colors.primary} />,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.black,
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '1.5rem',
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.black,
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                        }}
                      >
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{item.title}</h4>
                      <p style={{ color: colors.lightGray }}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parcours livreur */}
            <div
              style={{
                backgroundColor: colors.gray,
                padding: '2rem',
                borderRadius: '12px',
              }}
            >
              <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: colors.primary }}>
                Pour les livreurs
              </h3>
              <p style={{ color: colors.lightGray, marginBottom: '1.5rem' }}>
                Gagnez de l'argent en acceptant des missions proches de vous et en livrant des colis en toute sécurité.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  {
                    step: '1',
                    title: 'Inscrivez-vous comme livreur',
                    description: 'Créez votre profil, complétez vos informations et validez votre compte.',
                    icon: <User size={30} color={colors.primary} />,
                  },
                  {
                    step: '2',
                    title: 'Acceptez une mission',
                    description: 'Recevez des propositions de missions et acceptez celles qui vous conviennent.',
                    icon: <Package size={30} color={colors.primary} />,
                  },
                  {
                    step: '3',
                    title: 'Récupérez et livrez le colis',
                    description: 'Suivez l’itinéraire, récupérez le colis et livrez-le au client.',
                    icon: <MapPin size={30} color={colors.primary} />,
                  },
                  {
                    step: '4',
                    title: 'Recevez votre paiement',
                    description: 'Vos gains sont crédités sur votre portefeuille Cliver après chaque mission.',
                    icon: <Shield size={30} color={colors.primary} />,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.black,
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '1.5rem',
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.black,
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                        }}
                      >
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{item.title}</h4>
                      <p style={{ color: colors.lightGray }}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        style={{
          padding: '4rem 1.5rem',
          backgroundColor: colors.gray,
        }}
      >
        <div style={{ maxWidth: sectionMaxWidth, margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: 'clamp(2rem, 4.5vw, 2.5rem)',
              marginBottom: '0.75rem',
            }}
          >
            Tarifs et <span style={{ color: colors.primary }}>abonnements</span>
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: colors.lightGray,
              marginBottom: '2.5rem',
              maxWidth: '720px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Choisissez le plan qui correspond à votre activité, que vous soyez
            client ou livreur.
          </p>

          {pricingError && (
            <p
              style={{
                textAlign: 'center',
                color: '#ff6b6b',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
              }}
            >
              {pricingError}
            </p>
          )}

          {pricingLoading ? (
            <p
              style={{
                textAlign: 'center',
                color: colors.lightGray,
              }}
            >
              Chargement des tarifs...
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '2rem',
              }}
            >
              <div
                style={{
                  backgroundColor: colors.black,
                  padding: '2rem',
                  borderRadius: '12px',
                  border: `1px solid ${colors.primary}33`,
                }}
              >
                <h3
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    color: colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <User size={22} />
                  Clients
                </h3>

                {pricing.client.length === 0 ? (
                  <p style={{ color: colors.lightGray }}>
                    Aucun plan client disponible pour le moment.
                  </p>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    {pricing.client.map((plan: any) => (
                      <div
                        key={plan.id}
                        style={{
                          backgroundColor: colors.gray,
                          padding: '1.5rem',
                          borderRadius: '10px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            gap: '0.75rem',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <h4
                            style={{
                              fontSize: '1.1rem',
                              margin: 0,
                            }}
                          >
                            {plan.name}
                          </h4>
                          <span
                            style={{
                              color: colors.primary,
                              fontWeight: 700,
                              fontSize: '1rem',
                            }}
                          >
                            {formatPrice(plan.price, plan.currency)}
                          </span>
                        </div>
                        {plan.description && (
                          <p
                            style={{
                              color: colors.lightGray,
                              marginBottom: '0.5rem',
                              fontSize: '0.9rem',
                            }}
                          >
                            {plan.description}
                          </p>
                        )}
                        {plan.duration_days && (
                          <p
                            style={{
                              color: colors.lightGray,
                              fontSize: '0.85rem',
                              marginBottom: '0.25rem',
                            }}
                          >
                            Durée :{' '}
                            {plan.duration_days >= 30
                              ? `${Math.round(
                                  plan.duration_days / 30,
                                )} mois`
                              : `${plan.duration_days} jours`}
                          </p>
                        )}
                        {plan.max_missions_per_month && (
                          <p
                            style={{
                              color: colors.lightGray,
                              fontSize: '0.85rem',
                              marginBottom: '0.25rem',
                            }}
                          >
                            Jusqu'à {plan.max_missions_per_month} missions /
                            mois
                          </p>
                        )}
                        {plan.api_access && (
                          <p
                            style={{
                              color: colors.lightGray,
                              fontSize: '0.85rem',
                            }}
                          >
                            Accès API inclus
                          </p>
                        )}
                        {renderFeatures(plan.features)}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{
                  backgroundColor: colors.black,
                  padding: '2rem',
                  borderRadius: '12px',
                  border: `1px solid ${colors.primary}33`,
                }}
              >
                <h3
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    color: colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Package size={22} />
                  Livreurs
                </h3>

                {pricing.livreur.length === 0 ? (
                  <p style={{ color: colors.lightGray }}>
                    Aucun plan livreur disponible pour le moment.
                  </p>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    {pricing.livreur.map((plan: any) => (
                      <div
                        key={plan.id}
                        style={{
                          backgroundColor: colors.gray,
                          padding: '1.5rem',
                          borderRadius: '10px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            gap: '0.75rem',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <h4
                            style={{
                              fontSize: '1.1rem',
                              margin: 0,
                            }}
                          >
                            {plan.name}
                          </h4>
                          <span
                            style={{
                              color: colors.primary,
                              fontWeight: 700,
                              fontSize: '1rem',
                            }}
                          >
                            {formatPrice(plan.price, plan.currency)}
                          </span>
                        </div>
                        {plan.description && (
                          <p
                            style={{
                              color: colors.lightGray,
                              marginBottom: '0.5rem',
                              fontSize: '0.9rem',
                            }}
                          >
                            {plan.description}
                          </p>
                        )}
                        {plan.duration_days && (
                          <p
                            style={{
                              color: colors.lightGray,
                              fontSize: '0.85rem',
                              marginBottom: '0.25rem',
                            }}
                          >
                            Durée :{' '}
                            {plan.duration_days >= 30
                              ? `${Math.round(
                                  plan.duration_days / 30,
                                )} mois`
                              : `${plan.duration_days} jours`}
                          </p>
                        )}
                        {plan.max_missions_per_month && (
                          <p
                            style={{
                              color: colors.lightGray,
                              fontSize: '0.85rem',
                              marginBottom: '0.25rem',
                            }}
                          >
                            Jusqu'à {plan.max_missions_per_month} missions /
                            mois
                          </p>
                        )}
                        {plan.api_access && (
                          <p
                            style={{
                              color: colors.lightGray,
                              fontSize: '0.85rem',
                            }}
                          >
                            Accès API inclus
                          </p>
                        )}
                        {renderFeatures(plan.features)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: '4rem 1.5rem',
          backgroundColor: colors.primary,
          color: colors.black,
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 2.5rem)',
              marginBottom: '1.5rem',
            }}
          >
            Prêt à essayer Cliver ?
          </h2>
          <p
            style={{
              fontSize: 'clamp(1rem, 3.5vw, 1.25rem)',
              marginBottom: '2rem',
            }}
          >
            Téléchargez l'application dès maintenant et bénéficiez de 10€ de réduction sur votre première commande !
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
                backgroundColor: colors.black,
                color: colors.white,
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Apple size={22} />
              <span className="lp-section-btn-label">App Store</span>
            </button>
            <button
              style={{
                backgroundColor: colors.black,
                color: colors.white,
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Play size={22} />
              <span className="lp-section-btn-label">Google Play</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: colors.black,
          color: colors.white,
          padding: '4rem 2rem 2rem',
          borderTop: `1px solid ${colors.gray}`,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div style={{ maxWidth: sectionMaxWidth, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Image
                  src="/images/cliver-logo.png"
                  alt="Cliver Logo"
                  width={44}
                  height={44}
                  style={{ objectFit: 'contain' }}
                />
                <span style={{ fontSize: '1.75rem', fontWeight: '700', fontFamily: "'Poppins', sans-serif" }}>Cliver</span>
              </div>
              <p style={{ color: colors.lightGray, marginBottom: '1.5rem', lineHeight: '1.6' }}>
                La solution de livraison la plus rapide et fiable de votre région.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {[
                  { name: 'facebook', icon: <Facebook size={18} /> },
                  { name: 'twitter', icon: <Twitter size={18} /> },
                  { name: 'instagram', icon: <Instagram size={18} /> },
                  { name: 'linkedin', icon: <Linkedin size={18} /> },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={`https://${social.name}.com/cliver`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: colors.white,
                      backgroundColor: colors.gray,
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = colors.gray;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: colors.primary }}>Liens rapides</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Accueil', 'Fonctionnalités', 'Comment ça marche', 'Tarifs', 'Contact'].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      style={{
                        color: colors.lightGray,
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = colors.primary)}
                      onMouseOut={(e) => (e.currentTarget.style.color = colors.lightGray)}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                marginBottom: '1.5rem', 
                color: colors.primary,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '600'
              }}>
                Contact
              </h3>
              <address style={{ fontStyle: 'normal', color: colors.lightGray }}>
                <p style={{ 
                  margin: '0 0 1rem', 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.75rem',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  <MapPin size={18} color={colors.primary} style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <span>Maison des Jeunes<br />Adidogome Lomé-Togo</span>
                </p>
                <p style={{ 
                  margin: '0 0 1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  <Phone size={18} color={colors.primary} />
                  <a 
                    href="tel:+22899999999" 
                    style={{ 
                      color: colors.lightGray, 
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = colors.primary)}
                    onMouseOut={(e) => (e.currentTarget.style.color = colors.lightGray)}
                  >
                    +228 79 46 19 31
                  </a>
                </p>
                <p style={{ 
                  margin: '0 0 1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  <Mail size={18} color={colors.primary} />
                  <a 
                    href="mailto:contact@cliver.app" 
                    style={{ 
                      color: colors.lightGray, 
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = colors.primary)}
                    onMouseOut={(e) => (e.currentTarget.style.color = colors.lightGray)}
                  >
                    contact@cliver.app
                  </a>
                </p>
              </address>
            </div>
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                marginBottom: '1.5rem', 
                color: colors.primary,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '600'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MailOpen size={20} />
                  <span>Newsletter</span>
                </div>
              </h3>
              <p style={{ 
                color: colors.lightGray, 
                marginBottom: '1.5rem',
                fontFamily: "'Poppins', sans-serif",
                lineHeight: '1.6'
              }}>
                Abonnez-vous à notre newsletter pour recevoir nos offres spéciales.
              </p>
              <form
                className="lp-footer-newsletter-form"
                style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
              >
                <div style={{ position: 'relative', flex: 1 }}>
                  <Mail 
                    size={18} 
                    color={colors.lightGray} 
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      opacity: 0.7
                    }} 
                  />
                  <input
                    type="email"
                    placeholder="Votre email"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 40px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: colors.gray,
                      color: colors.white,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = 'none';
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.primary}80`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.black,
                    border: 'none',
                    padding: '0 1.5rem',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 127, 48, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Send size={18} />
                  <span>OK</span>
                </button>
              </form>
              <p style={{ 
                color: colors.lightGray, 
                fontSize: '0.8rem',
                marginTop: '0.75rem',
                opacity: 0.7,
                fontFamily: "'Poppins', sans-serif"
              }}>
                En vous abonnant, vous acceptez notre politique de confidentialité.
              </p>
            </div>
          </div>
          <div
            style={{
              marginTop: '4rem',
              paddingTop: '2rem',
              borderTop: `1px solid ${colors.gray}`,
              textAlign: 'center',
              color: colors.lightGray,
              fontSize: '0.9rem',
            }}
          >
            <p>© {new Date().getFullYear()} Cliver. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
