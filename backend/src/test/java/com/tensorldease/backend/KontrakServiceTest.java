package com.tensorldease.backend;

import com.tensorldease.backend.dto.request.KontrakClientRequest;
import com.tensorldease.backend.dto.response.KontrakResponse;
import com.tensorldease.backend.model.Client;
import com.tensorldease.backend.model.PaketHpc;
import com.tensorldease.backend.model.User;
import com.tensorldease.backend.repository.*;
import com.tensorldease.backend.service.KontrakService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KontrakServiceTest {

    @Mock private KontrakRepository kontrakRepository;
    @Mock private ClientRepository clientRepository;
    @Mock private AdminRepository adminRepository;
    @Mock private PaketHpcRepository paketHpcRepository;

    @InjectMocks
    private KontrakService kontrakService;

    private Client mockClient;
    private PaketHpc mockPaket;

    @BeforeEach
    void setUp() {
        User mockUser = new User();
        mockUser.setNama("Budi Santoso");

        mockClient = new Client();
        mockClient.setClientId("client-01");
        mockClient.setUser(mockUser);

        mockPaket = new PaketHpc();
        mockPaket.setPaketId("paket-01");
        mockPaket.setNamaPaket("GPU Pro X1");
        mockPaket.setStatus("AKTIF");
        mockPaket.setJumlahUnit(5);
        mockPaket.setTarif(5000000.0);
    }

    // PATH 1: Client tidak ditemukan
    @Test
    void path1_clientTidakDitemukan_throwException() {
        when(clientRepository.findById("invalid-xxx")).thenReturn(Optional.empty());

        KontrakClientRequest req = new KontrakClientRequest();
        req.setClientId("invalid-xxx");
        req.setPaketId("paket-01");

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> kontrakService.buatKontrakByClient(req));
        assertEquals("Client tidak ditemukan!", ex.getMessage());
    }

    // PATH 2: Paket tidak ditemukan
    @Test
    void path2_paketTidakDitemukan_throwException() {
        when(clientRepository.findById("client-01")).thenReturn(Optional.of(mockClient));
        when(paketHpcRepository.findById("invalid-xxx")).thenReturn(Optional.empty());

        KontrakClientRequest req = new KontrakClientRequest();
        req.setClientId("client-01");
        req.setPaketId("invalid-xxx");

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> kontrakService.buatKontrakByClient(req));
        assertEquals("Paket tidak ditemukan!", ex.getMessage());
    }

    // PATH 3: Paket tidak aktif
    @Test
    void path3_paketTidakAktif_throwException() {
        mockPaket.setStatus("NONAKTIF");
        when(clientRepository.findById("client-01")).thenReturn(Optional.of(mockClient));
        when(paketHpcRepository.findById("paket-01")).thenReturn(Optional.of(mockPaket));

        KontrakClientRequest req = new KontrakClientRequest();
        req.setClientId("client-01");
        req.setPaketId("paket-01");

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> kontrakService.buatKontrakByClient(req));
        assertEquals("Paket tidak tersedia!", ex.getMessage());
    }

    // PATH 4: Unit paket habis
    @Test
    void path4_unitPaketHabis_throwException() {
        mockPaket.setJumlahUnit(0);
        when(clientRepository.findById("client-01")).thenReturn(Optional.of(mockClient));
        when(paketHpcRepository.findById("paket-01")).thenReturn(Optional.of(mockPaket));

        KontrakClientRequest req = new KontrakClientRequest();
        req.setClientId("client-01");
        req.setPaketId("paket-01");

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> kontrakService.buatKontrakByClient(req));
        assertEquals("Unit paket sudah habis!", ex.getMessage());
    }

    // PATH 5: Semua valid — kontrak berhasil dibuat
    @Test
    void path5_semuaValid_kontrakBerhasilDibuat() {
        when(clientRepository.findById("client-01")).thenReturn(Optional.of(mockClient));
        when(paketHpcRepository.findById("paket-01")).thenReturn(Optional.of(mockPaket));
        when(kontrakRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(paketHpcRepository.save(any())).thenReturn(mockPaket);

        KontrakClientRequest req = new KontrakClientRequest();
        req.setClientId("client-01");
        req.setPaketId("paket-01");
        req.setTanggalMulai(LocalDate.now().plusDays(10)); // future → PENDING
        req.setDurasibulan(3);
        req.setCatatan("Pengujian unit test");

        KontrakResponse result = kontrakService.buatKontrakByClient(req);

        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
        assertEquals(15000000.0, result.getTotalBiaya());
        assertTrue(result.getNomorKontrak().startsWith("KTR-"));
        assertEquals(4, mockPaket.getJumlahUnit()); // unit berkurang 1 dari 5
    }
}