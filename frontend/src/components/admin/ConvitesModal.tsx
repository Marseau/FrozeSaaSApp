import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, QrCode, RefreshCw, Eye, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import QRCode from 'qrcode';

interface Convite {
  id: string;
  email: string;
  token: string;
  expires_at: string;
  status: 'pendente' | 'usado' | 'expirado';
  created_at: string;
  empresas?: {
    nome: string;
  };
}

interface ConvitesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConvitesModal = ({ open, onOpenChange }: ConvitesModalProps) => {
  const [convites, setConvites] = useState<Convite[]>([]);
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [selectedConvite, setSelectedConvite] = useState<string>('');

  useEffect(() => {
    if (open) {
      fetchConvites();
    }
  }, [open]);

  const fetchConvites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('convites_cadastro')
        .select(`
          *,
          empresas!inner(nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fazer cast dos dados para garantir que o status seja do tipo correto
      const convitesTyped = (data || []).map(item => ({
        ...item,
        status: item.status as 'pendente' | 'usado' | 'expirado'
      }));
      
      setConvites(convitesTyped);
    } catch (error) {
      console.error('Erro ao buscar convites:', error);
      toast.error('Erro ao carregar convites');
    } finally {
      setLoading(false);
    }
  };

  const generateInviteLink = (token: string) => {
    return `${window.location.origin}/cadastro-empresa?token=${token}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copiado para área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  const generateQRCode = async (token: string) => {
    try {
      const link = generateInviteLink(token);
      const qrCodeDataUrl = await QRCode.toDataURL(link, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrCodeDataUrl);
      setSelectedConvite(token);
    } catch (error) {
      toast.error('Erro ao gerar QR Code');
    }
  };

  const resendInvite = async (conviteId: string) => {
    try {
      // Buscar dados do convite
      const { data: convite, error: conviteError } = await supabase
        .from('convites_cadastro')
        .select(`
          *,
          empresas!inner(nome, email)
        `)
        .eq('id', conviteId)
        .single();

      if (conviteError || !convite) {
        throw new Error('Convite não encontrado');
      }

      // Buscar dados do plano
      const { data: assinatura, error: assinaturaError } = await supabase
        .from('assinaturas')
        .select(`
          *,
          planos(mensalidade, percentual_receita)
        `)
        .eq('empresa_id', convite.empresa_id)
        .eq('status', 'ativa')
        .single();

      if (assinaturaError || !assinatura) {
        throw new Error('Assinatura não encontrada');
      }

      // Reenviar email usando edge function
      const { error } = await supabase.functions.invoke('enviar-convite-empresa', {
        body: {
          empresa_id: convite.empresa_id,
          nome_empresa: convite.empresas.nome,
          email: convite.email,
          token: convite.token,
          mensalidade: assinatura.planos.mensalidade,
          percentual: assinatura.planos.percentual_receita || 0
        }
      });

      if (error) throw error;

      toast.success('Convite reenviado com sucesso!');
    } catch (error) {
      console.error('Erro ao reenviar convite:', error);
      toast.error('Erro ao reenviar convite');
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getStatusBadge = (convite: Convite) => {
    if (convite.status === 'usado') {
      return <Badge variant="secondary">Usado</Badge>;
    }
    if (isExpired(convite.expires_at)) {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    return <Badge variant="default">Ativo</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Convites de Cadastro</DialogTitle>
          <DialogDescription>
            Gerencie os convites enviados para novas empresas. O email de boas-vindas é enviado automaticamente com todas as instruções necessárias.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Carregando convites...</div>
          ) : (
            <>
              {convites.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum convite encontrado
                </div>
              ) : (
                convites.map((convite) => (
                  <Card key={convite.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {convite.empresas?.nome || 'Empresa'}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{convite.email}</p>
                        </div>
                        {getStatusBadge(convite)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Input
                            value={generateInviteLink(convite.token)}
                            readOnly
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generateInviteLink(convite.token))}
                          >
                            <Copy size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateQRCode(convite.token)}
                          >
                            <QrCode size={16} />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>
                            Criado em: {new Date(convite.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          <span>
                            Expira em: {new Date(convite.expires_at).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(convite.expires_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        {convite.status === 'pendente' && !isExpired(convite.expires_at) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resendInvite(convite.id)}
                            className="w-full"
                          >
                            <Mail size={16} className="mr-2" />
                            Reenviar Convite
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}

          {qrCodeUrl && selectedConvite && (
            <Card>
              <CardHeader>
                <CardTitle>QR Code do Convite</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4" />
                <Button
                  variant="outline"
                  onClick={() => {
                    setQrCodeUrl('');
                    setSelectedConvite('');
                  }}
                >
                  Fechar QR Code
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConvitesModal;
