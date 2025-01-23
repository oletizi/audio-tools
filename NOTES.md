## Look at:
### Components
* https://www.radix-ui.com/
* https://www.chakra-ui.com/
* https://react-bootstrap.netlify.app/
* https://tailwindcss.com/
* https://shoelace.style/
* https://styled-components.com/docs
* https://open-ui.org/
* https://www.webcomponents.org/
* https://slimjs.com/#/welcome

### Frameworks
* https://svelte.dev/
* https://alpinejs.dev/
* https://vuejs.org/

## PiSCSI sync
`ssh pi-scsi.local /home/orion/mount.sh && rsync -e ssh -av . pi-scsi.local:~/stacks2/ && ssh pi-scsi.local sudo /home/orion/umount.sh`

## Akai & SCSI Resources
* [SCSI2Pi&mdash;Superset of PiSCSI](https://www.scsi2pi.net/)
* [Akai tools (CLI for manipulating Akai volumes via SCSI)](https://www.lsnl.jp/~ohsaki/software/akaitools/)
* [tcmu-runner](https://github.com/open-iscsi/tcmu-runner)
* [Linux SCSI Interfaces Guide](https://www.kernel.org/doc/html/v4.13/driver-api/scsi.html)
* [iSCSI Linux target framework (tgt)](https://github.com/fujita/tgt)
* [Generic SCSI Target Subsystem for Linux](https://scst.sourceforge.net/)
* [Rasbperry pi as iSCSI target](https://www.stephenwagner.com/2020/03/18/how-to-raspberry-pi-4-as-an-iscsi-san-iscsi-target/)

/iscsi/iqn.20...4-target/tpg1> set attribute demo_mode_write_protect=0
