import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { supabase } from '@/database/supabase';

export default function Index() {

  const [sesion, setSesion] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {

    const verificarSesion = async () => {

      const { data } = await supabase.auth.getSession();

      setSesion(data.session);
      setCargando(false);
    };

    verificarSesion();

  }, []);

  if (cargando) {
    return null;
  }

  if (sesion) {
    return <Redirect href="/products" />;
  }

  return <Redirect href="/login" />;
}